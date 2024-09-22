import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import logger from "../util/logger";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";
import { SensorData } from "../models/Sensor-Data";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import hasha from "hasha";
import moment from "moment";

import redisClient from "../config/redisConfig";

export const createOffer = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const username = req.user.email;
    const org = req.user.orgname;
    const orgname = req.user.type;
    console.log(req.user);
    payload["creator"] = username;
    console.log(payload, "payload");

    const message2: any = JSON.stringify({
      startDateTime: parseInt(
        moment
          .utc(payload.depart_time)
          .local()
          .format("x")
      ),
      endDateTime: parseInt(
        moment
          .utc(payload.arrival_time)
          .local()
          .format("x")
      ),
      deviceId: payload.monitered_asset,
    });
    console.log(message2, "message2");

    // Publish the message to a specific channel
    redisClient.publish(
      "device_cmd",
      message2,
      async (err: any, reply: any) => {
        if (err) {
          console.error("Error publishing message:", err);
          res.send("Something went wrong!");
        } else {
          console.log("Message published:", reply);
          const response = await invokeTransaction(
            CHANNEL,
            CHAINCODE,
            "InsertDataOffer",
            JSON.stringify(payload),
            username,
            org
          );
          logger.info(response);
          res.send(response);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getAllOffers = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.user.type == "Provider, Admin" ? req.user.email : "";
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAllOffers",
      email,
      username,
      org
    );
    logger.info(response);
    // res.send(response);
    if (orgname == "Provider" && response) {
      const x = response.filter(
        (item: any) => item.Record.data_owner == username
      );

      res.send(x);
    } else {
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
};

export const getOfferById = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.user.type == "Provider, Admin" ? req.user.email : "";
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const offerID = req.params.id;
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetOffer",
      offerID,
      username,
      org
    );
    logger.info(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getOfferHash = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    //param is the offer id
    console.log("get offer", req.params);
    const offer_id = req.params.offer_id;
    const username = req.user.email;
    const org = req.user.orgname;

    const offerID = [offer_id, username];

    const offerRequest = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetOfferRequestByOfferID",
      offerID,
      username,
      org
    );

    console.log(offerRequest, "offerRequest");

    if (offerRequest.length > 0) {
      if (offerRequest[0].agreement_id == "") {
        res.status(404).send("No data found");
      } else {
        const agreementID = offerRequest[0].agreement_id;
        const x = await queryLedger(
          CHANNEL,
          CHAINCODE,
          "GetDataHashByAgreementID",
          agreementID,
          username,
          org
        );
        console.log(x, "GetDataHashByAgreementID");

        if (!x) {
          console.log("no data hashes");
          const endDate = moment
            .utc(offerRequest[0].offer_details.arrival_time)
            .add(5, "minutes")
            .toDate();
          console.log("endDate :", endDate);
          const startDate = moment
            .utc(offerRequest[0].offer_details.depart_time)
            .subtract(5, "minutes")
            .toDate();
          console.log("startDate :", startDate);
          const sensorData = await SensorData.findOne({
            device_id: req.params.id,
            timestamp: { $gte: startDate, $lte: endDate },
          });
          console.log(sensorData);

          if (sensorData) {
            const data = sensorData.data;
            // Create a new workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sensor Data");

            // Add headers to the worksheet
            worksheet.addRow(["Device ID", "Data", "Timestamp"]);

            // Add data rows to the worksheet
            data.forEach((item) => {
              worksheet.addRow([item.deviceid, item.data, item.timestamp]);
            });

            // Save the workbook to a file
            const filePath = `./uploads/sensor_data-${offer_id}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            const readFile = (filePath: string) => {
              return new Promise((resolve, reject) => {
                fs.readFile(filePath, (err, data) => {
                  if (err) {
                    reject(err);
                  }
                  resolve(data);
                });
              });
            };
            console.log(filePath);
            console.log("read file", readFile);

            //read file
            const file = await readFile(filePath);
            console.log(file);

            const buffer = await workbook.xlsx.writeBuffer();
            console.log(buffer);

            const filename = `sensor_data-${offer_id}.xlsx`;
            const rootPath = path.resolve("./");
            const completeFilePath = `${rootPath}/${filePath.slice(2)}`;
            console.log(completeFilePath);

            const hash = await hasha.fromFile(completeFilePath, {
              algorithm: "sha3-256",
            });
            console.log(hash);

            const fileHash = {
              filename: filename,
              md5: hash,
            };
            console.log(fileHash);

            //after upload delete file from local storage
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });

            res.status(200).send(fileHash);
          } else {
            res.status(404).send("No data found");
          }
        } else {
          const offer_data_hash_ids = x.agreement.offer_data_hash_id;
          console.log(x.hashes);
          const datahash = x.hashes.map((item: any) => item.data_hashes).flat();
          const p = datahash.filter(
            (item: any) => offer_data_hash_ids.indexOf(item.id) !== -1
          );
          const k = p.map((item: any) => {
            console.log(item);
            return {
              ...item,
              offer_id: x.agreement.offer_id,
            };
          });
          console.log(k, "k");

          const fileHash = {
            filename: k[0].file_name,
            md5: k[0].hash,
          };
          console.log(fileHash);
          res.status(200).send(fileHash);

          // res.send(k);
        }
      }
    } else {
      res.status(404).send("No data found");
    }

    // const sensorData = await SensorData.findOne({ device_id: req.params.id });
    // console.log(sensorData);
    // if (sensorData) {
    //   const data = sensorData.data;
    //   // Create a new workbook and worksheet
    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("Sensor Data");

    //   // Add headers to the worksheet
    //   worksheet.addRow(["Device ID", "Data", "Timestamp"]);

    //   // Add data rows to the worksheet
    //   data.forEach((item) => {
    //     worksheet.addRow([item.deviceid, item.data, item.timestamp]);
    //   });

    //   // Save the workbook to a file
    //   const filePath = `./uploads/sensor_data-${offer_id}.xlsx`;
    //   await workbook.xlsx.writeFile(filePath);

    //   const readFile = (filePath: string) => {
    //     return new Promise((resolve, reject) => {
    //       fs.readFile(filePath, (err, data) => {
    //         if (err) {
    //           reject(err);
    //         }
    //         resolve(data);
    //       });
    //     });
    //   };
    //   console.log(filePath);
    //   console.log("read file", readFile);

    //   //read file
    //   const file = await readFile(filePath);
    //   console.log(file);

    //   const buffer = await workbook.xlsx.writeBuffer();
    //   console.log(buffer);

    //   const filename = `sensor_data-${offer_id}.xlsx`;
    //   const rootPath = path.resolve("./");
    //   const completeFilePath = `${rootPath}/${filePath.slice(2)}`;
    //   console.log(completeFilePath);

    //   const hash = await hasha.fromFile(completeFilePath, {
    //     algorithm: "sha3-256",
    //   });
    //   console.log(hash);

    //   const fileHash = {
    //     filename: filename,
    //     md5: hash,
    //   };
    //   console.log(fileHash);

    //   //after upload delete file from local storage
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //   });

    //   res.status(200).send(fileHash);
    // } else {
    //   res.status(404).send("No data found");
    // }
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    console.log(req.user);
    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "UpdateDataOffer",
      JSON.stringify(payload),
      username,
      org
    );
    logger.info(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const historicalDataOffer = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const username = req.user.email;
    const org = req.user.orgname;
    const orgname = req.user.type;
    console.log(req.user);
    payload["creator"] = username;
    console.log("Payload", payload);
    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "InsertHistoricalDataOffer",
      JSON.stringify(payload),
      username,
      org
    );
    logger.info(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const getHistoricalOfferById = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("get offer", req.params);
    const email = req.user.type == "Provider, Admin" ? req.user.email : "";
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const offerID = req.params.id;
    // const response = await queryLedger(
    //   CHANNEL,
    //   CHAINCODE,
    //   "GetHistoricalOfferRequestByID",
    //   offerID,
    //   username,
    //   org
    // );
    // console.log(response,"HISTORICAL" );
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAllHistoricalOfferRequest",
      "",
      username,
      org
    );
    console.log(response, "RESPONSE");
    logger.info(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const updateHistoricalOffer = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    console.log(req.user);
    console.log("Payload", payload);
    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "UpdateHistoicalDataOffer",
      JSON.stringify(payload),
      username,
      org
    );
    logger.info(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

// export const getAllHistoricalOffers = async (req: ReqUser, res: Response, next: NextFunction) => {

//     try {
//         console.log("Hello",req.user);
//         const email = req.user.type == "Provider, Admin"  ? req.user.email : "";
//         const username = req.user.email;
//         const orgname = req.user.type;
//         const org=req.user.orgname;
//         const response = await queryLedger(CHANNEL, CHAINCODE, "GetAllHistoricalOffer", email, username, org);
//         logger.info(response);
//         res.send(response);

//     //    if (orgname == "Provider" && response) {
//     //        const x = response.filter((item: any) => item.Record.dataOwner == username);
//     //        res.send(x);
//     //    } else {
//     //         res.send(response);
//     //     }

//     } catch (error) {
//         next(error);
//     }

// };

export const getAllHistoricalOffers = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.user.type == "Provider, Admin" ? req.user.email : "";
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAllHistoricalOffer",
      email,
      username,
      org
    );
    logger.info(response);
    console.log(response);
    // res.send(response);
    if (orgname == "Provider" && response) {
      const x = response.filter((item: any) => item.data_owner == username);
      console.log(x);
      res.send(x);
    } else {
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
};
