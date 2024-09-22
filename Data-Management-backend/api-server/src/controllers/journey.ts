import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import logger from "../util/logger";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";

export const journeySchedule = async (
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
    console.log(payload);
    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "JourneySchedule",
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

export const getAllJourney = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAllJourney",
      "",
      username,
      org
    );
    logger.info(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const updateJourneySchedule = async (
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
      "UpdateJourneySchedule",
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

export const getJourneyByUID = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    const key = req.body.key;

    const payload = [key];
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetJourneyByUID",
      payload,
      username,
      org
    );
    res.send(response);
  } catch (error) {
    next(error);
  }
};
