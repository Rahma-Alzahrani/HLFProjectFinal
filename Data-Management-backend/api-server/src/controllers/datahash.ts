import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import { ulid as v4 } from "ulid";
import invokeTransaction from "../util/invoke";
import logger from "../util/logger";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";
import moment from "moment";
import mongoose from "mongoose";
import ExcelJS from "exceljs";
import fs from "fs";
import { SensorData } from "../models/Sensor-Data";

export const saveDataHash = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const offerId = req.body.offer_id;
    const hashID = req.body.hash_id;
    const dataHash = req.body.datahash;
    const filename = req.body.filename;
    const entrydate = req.body.entrydate;
    const device_id = req.body.device_id;
    const offerDataHashID = v4();
    const payload = [
      offerId,
      hashID,
      dataHash,
      filename,
      entrydate,
      offerDataHashID,
    ];
    console.log(payload, "payloadCHECK");

    const offerID = [offerId, username];

    const offerRequest = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetOfferRequestByOfferID",
      offerID,
      username,
      org
    );

    console.log(offerRequest, "offerRequest");

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
      device_id: device_id,
      timestamp: { $gte: startDate, $lte: endDate },
    });
    console.log(sensorData, "sensorData");
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
      const filePath = `./uploads/sensor_data-${offerId}.xlsx`;
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

      const filename = `sensor_data-${offerId}.xlsx`;

      // Save the file to GridFS storage
      const conn = mongoose.connection;
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
      });
      const uploadStream = bucket.openUploadStream(filename);
      uploadStream.write(buffer);
      uploadStream.end();

      const response = await invokeTransaction(
        CHANNEL,
        CHAINCODE,
        "InsertDataHash",
        payload,
        username,
        org
      );
      console.log(response);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      res.send(response);
    } else {
      res.send({ message: "Device ID not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const GetDataHashByOffer = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const offerId = req.body.offer_id;

    const payload = [offerId, username];
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetDataHashByOfferID",
      payload,
      username,
      org
    );
    console.log(response, "RESS");

    if (!response) {
      res.send({ message: "No data hashes found for this offer" });
    } else {
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
};

export const GetDataHashByAgreement = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const agreementID = req.body.agreement_id;
    console.log(agreementID);
    console.log(username);
    console.log(org);
    const hashData = [];

    //get agreement by id
    const agreement = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAgreementByID",
      agreementID,
      username,
      org
    );
    console.log(agreement, "agreement");

    const currentDate = moment()
      .utc()
      .format("YYYY-MM-DD HH:mm");
    console.log(currentDate, "currentDAte");
    const endDate = agreement.end_date;
    console.log(endDate, "endDate");

    if (moment(currentDate) < moment(endDate)) {
      console.log("expired");
      res.send({ message: "Wait for end date to get data hashes" });
    } else {
      try {
        const offerRequest = await queryLedger(
          CHANNEL,
          CHAINCODE,
          "GetHistoricalOfferRequestByID",
          agreement.offer_request_id,
          username,
          org
        );
        console.log(offerRequest, "offerRequest");

        let dataProvider = "",
          dataConsumer = "",
          operator = "";
        if (orgname == "Provider") {
          dataProvider = username;
        } else {
          dataConsumer = username;
        }

        if (dataConsumer && dataProvider) {
          operator = "$and";
        } else {
          operator = "$or";
        }
        // dataProvider, dataConsumer, operator string
        const payload = [dataProvider, dataConsumer, operator];
        console.log(payload);
        const response = await queryLedger(
          CHANNEL,
          CHAINCODE,
          "GetAllAgreements",
          payload,
          username,
          org
        );
        console.log(response.length, "ccccc");
        const agreementIDs = [];

        for (let i = 0; i < response.length; i++) {
          console.log(response[i].offer_id, "response[i].offer_id In LOOP");
          if (offerRequest.multiple_offer_id) {
            offerRequest.multiple_offer_id.map(async (offer_id: any) => {
              console.log(offer_id, "offer_id");
              const offerID = offer_id;

              if (response[i].offer_id == offerID) {
                console.log(
                  response[i].agreement_id,
                  "response[i].agreement_id"
                );
                agreementIDs.push(response[i].id);
              }
            });
          }
        }

        console.log(agreementIDs, "agreementIDs");
        if (agreementIDs.length > 0) {
          // setTimeout(() => {
          agreementIDs.map(async (agreement_id: any) => {
            console.log(agreement_id, "agreement_id");

            queryLedger(
              CHANNEL,
              CHAINCODE,
              "GetDataHashByAgreementID",
              agreement_id,
              username,
              org
            ).then(async (x: any) => {
              console.log(x, "xx");
              const offer_data_hash_ids = x.agreement.offer_data_hash_id;
              console.log(x.hashes);
              const datahash = await x.hashes
                .map((item: any) => item.data_hashes)
                .flat();
              const p = await datahash.filter(
                (item: any) => offer_data_hash_ids.indexOf(item.id) !== -1
              );
              const k = await p.map((item: any) => {
                console.log(item);
                return {
                  ...item,
                  offer_id: x.agreement.offer_id,
                };
              });

              console.log(k, "kgf");
              console.log(k, "kgf");

              console.log(k, "kgf");

              hashData.push(k[0]);
            });
          });
          // }, 5000);

          const timer = setInterval(() => {
            if (hashData.length > 0) {
              clearInterval(timer);
              res.send(hashData);
            }
          }, 1000);
          return;
        }

        console.log(hashData, "hashData");
      } catch (err) {
        console.log(err, "err");
      }

      const x = await queryLedger(
        CHANNEL,
        CHAINCODE,
        "GetDataHashByAgreementID",
        agreementID,
        username,
        org
      );
      console.log(x, "xxxx");

      logger.info("response");
      // console.log(x.agreement.offer_request_id, "x.agreement.offer_request_id");

      if (!x) {
        console.log("no data hashes");
        res.send([]);
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

        res.send(k);
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
