import express, { NextFunction, Response } from "express";
import * as multer from "multer";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import { CHAINCODE, CHANNEL } from "../util/secrets";
import authRouter from "./auth";
import claimRouter from "./claim.router";
import cost from "./cost";
import DataAgreementRouter from "./dataAgreement.route";
import DataHashRouter from "./datahash.router";
import EscrowRouter from "./escrow";
import fileRouter from "./file";
import offerRouter from "./offer.router";
import historicalOfferRouter from "./historicalOffers.router";
import offerRequestRouter from "./offerRequest.router";
import adminRouter from "./admin";
import journeyRouter from "./journey.router";
import sensorDataRouter from "./sensorData.router";
import transactionDetailsRouter from "./transactional-details.router";
import bankDetailsRouter from "./bank-details.router";
const router = express.Router();

/**
 * Primary app routes.
 */

export default function (upload: multer.Multer) {
  router.use("/auth", authRouter);
  router.use("/offer", offerRouter);
  router.use("/historiclOffer", historicalOfferRouter);
  router.use("/files", fileRouter(upload));
  router.use("/offerRequest", offerRequestRouter);
  router.use("/dataagreement", DataAgreementRouter);
  router.use("/escrow", EscrowRouter);
  router.use("/datahash", DataHashRouter);
  router.use("/cost", cost);
  router.use("/claim", claimRouter);
  router.use("/admin", adminRouter);
  router.use("/journey", journeyRouter);
  router.use("/sensorData", sensorDataRouter);
  router.use("/transactionDetails", transactionDetailsRouter);
  router.use("/bankDetails", bankDetailsRouter);

  router.post(
    "/delete",
    async (req: ReqUser, res: Response, next: NextFunction) => {
      console.log(req.body);
      const data = req.body;
      const username = req.user.email;
      const orgname = req.user.type;
      const response = await invokeTransaction(
        CHANNEL,
        CHAINCODE,
        "DeleteData",
        JSON.stringify(data),
        username,
        orgname
      );
      res.send(response);
    }
  );
  return router;
}
