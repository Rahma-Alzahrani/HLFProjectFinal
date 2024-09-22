import { NextFunction, Response } from "express";
import { check } from "express-validator";
import { ReqUser } from "request-types";
// import { v4 } from "uuid";
import { ulid as v4 } from "ulid";
import invokeTransaction from "../util/invoke";
import { CHAINCODE, CHANNEL } from "../util/secrets";
import { storeFileToFs } from "./dataFile";
import { ClaimPeriod } from "../models/Claim-period";
import mongoose from "mongoose";
import queryLedger from "../util/query";
import moment from "moment";
import { forEach } from "async";

export const latencyClaim = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("offerId", "Offer ID is required")
      .exists()
      .run(req);
    await check("agreementId", "Agreement ID is required")
      .exists()
      .run(req);
    const username = req.user.email;
    const org = req.user.orgname;
    const costId = v4();
    const payload = [req.body.offerId, req.body.agreementId, costId];
    console.log("payload :", payload);
    const result = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "LatencyClaim",
      payload,
      username,
      org
    );

    res.send(JSON.parse(result["result"]));
  } catch (error) {
    next(error);
  }
};

export const falsifyClaim = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("offerId", "Offer ID is required")
      .exists()
      .run(req);
    await check("fileName", "Hash ID is required")
      .exists()
      .run(req);
    await check("agreementId", "Agreement ID is required")
      .exists()
      .run(req);
    const gfs = req.app.get("gfs");
    const fileNames = req.body.fileName;
    console.log("fileNames :", fileNames);
    const hashes = [];
    const username = req.user.email;
    const org = req.user.orgname;

    //Testing

    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAllDataHashes",
      "",
      username,
      org
    );
    console.log("response :", response);
    // Access the data_hashes array from the response object
    const dataHashesArray = response[0].data_hashes;
    console.log("dataHashesArray :", dataHashesArray);

    response.forEach((dataHash, index) => {
      console.log(`Object ${index + 1}:`, dataHash);
    });
    //

    for await (const fileName of fileNames) {
      // const { hash } = await storeFileToFs(gfs, fileName) as any;
      const fileDoc = await mongoose.connection.db
        .collection("uploads.files")
        .findOne({ filename: fileName });
      const hash = fileDoc.md5;
      hashes.push(hash);
    }
    console.log("hashes :", hashes);
    const costId = v4();
    const payload = [
      req.body.offerId,
      hashes.toString(),
      req.body.agreementId,
      costId,
    ];
    console.log("payload :", payload);
    const result = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "FalsifyClaim2",
      payload,
      username,
      org
    );

    res.send(JSON.parse(result["result"]));
  } catch (error) {
    next(error);
  }
};

export const missingClaim = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    await check("offerId", "Offer ID is required")
      .exists()
      .run(req);
    await check("fileName", "Hash ID is required")
      .exists()
      .run(req);
    await check("agreementId", "Agreement ID is required")
      .exists()
      .run(req);
    const gfs = req.app.get("gfs");
    const username = req.user.email;
    const org = req.user.orgname;
    const fileNames = req.body.fileName;
    const hashes = [];

    const date = new Date("2023-08-13 05:05").toISOString();
    const date1 = moment(date);

    // Extract date and time parts
    const formattedDate = date1.format("YYYY-MM-DD");
    const formattedTime = date1.format("HH:mm:ss");
    const formattedOffset = date1.format("Z"); // Offset like +05:30

    // Combine date, time, and offset
    const combinedDateTime = `${formattedDate}T${formattedTime}${formattedOffset}`;

    console.log("Combined date and time:", combinedDateTime);
    for await (const fileName of fileNames) {
      // const { hash } = await storeFileToFs(gfs, fileName) as any;
      const fileDoc = await mongoose.connection.db
        .collection("uploads.files")
        .findOne({ filename: fileName });
      console.log(fileDoc);
      const hash = fileDoc.md5;
      console.log("hash :", hash);
      console.log("hash :", hash);
      hashes.push(hash);
    }

    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAllDataHashes",
      "",
      username,
      org
    );
    console.log("response :", response);

    // Access the data_hashes array from the response object
    const dataHashesArray = response[0].data_hashes;
    console.log("dataHashesArray :", dataHashesArray);

    response.forEach((dataHash, index) => {
      console.log(`Object ${index + 1}:`, dataHash);
    });

    //Console log the objects in the data_hashes array
    dataHashesArray.forEach((dataHash, index) => {
      console.log(`Object ${index + 1}:`, dataHash);
    });

    const costId = v4();
    const payload = [
      req.body.offerId,
      hashes.toString(),
      req.body.agreementId,
      costId,
    ];
    console.log("payload :", payload);
    const result = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "FalsifyClaimUseCase2",
      payload,
      username,
      org
    );

    res.send(JSON.parse(result["result"]));
  } catch (error) {
    next(error);
  }
};

export const createClaimPeriod = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { claimPeriodHours, claimPeriodMinutes } = req.body;

    //check if claimPeriodHours and claimPeriodMinutes are numbers and not exceeding 24 hours
    if (
      typeof claimPeriodHours !== "number" ||
      typeof claimPeriodMinutes !== "number"
    ) {
      res
        .status(400)
        .send("claimPeriodHours and claimPeriodMinutes must be numbers");
      return;
    }
    if (claimPeriodHours > 24 || claimPeriodMinutes > 60) {
      res
        .status(400)
        .send(
          "claimPeriodHours must be less than 24 and claimPeriodMinutes must be less than 60"
        );
      return;
    }

    //check if claimPeriodHours and claimPeriodMinutes are positive numbers
    if (claimPeriodHours < 0 || claimPeriodMinutes < 0) {
      res
        .status(400)
        .send(
          "claimPeriodHours and claimPeriodMinutes must be positive numbers"
        );
      return;
    }

    //check if claimPeriodHours and claimPeriodMinutes are integers
    if (
      !Number.isInteger(claimPeriodHours) ||
      !Number.isInteger(claimPeriodMinutes)
    ) {
      res
        .status(400)
        .send("claimPeriodHours and claimPeriodMinutes must be integers");
      return;
    }

    //check if claim period already exists and if it does, update it
    const claimPeriodExists = await ClaimPeriod.findOne({
      claimPeriodCreated: true,
    });
    if (claimPeriodExists) {
      claimPeriodExists.claimPeriodHours = claimPeriodHours;
      claimPeriodExists.claimPeriodMinutes = claimPeriodMinutes;
      await claimPeriodExists.save();
      res.send(claimPeriodExists);
      return;
    }

    const claimPeriod = new ClaimPeriod({
      claimPeriodHours,
      claimPeriodMinutes,
      claimPeriodStatus: true,
      claimPeriodCreated: true,
    });
    await claimPeriod.save();
    res.send(claimPeriod);
  } catch (error) {
    next(error);
  }
};

export const getClaimPeriod = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const claimPeriod = await ClaimPeriod.findOne({ claimPeriodCreated: true });
    res.send(claimPeriod);
  } catch (error) {
    next(error);
  }
};
