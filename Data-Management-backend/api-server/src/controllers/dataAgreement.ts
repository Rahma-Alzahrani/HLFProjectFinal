import { NextFunction, Response } from "express";
import { ReqUser } from "request-types";
import invokeTransaction from "../util/invoke";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL } from "../util/secrets";
import { Payment } from "../models/Payment";
import createMollieClient from "@mollie/api-client";
const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY as string,
});

export const GetAllAgreements = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("GetAllAgreements");
    const orgname = req.user.type;
    const username = req.user.email;
    const org = req.user.orgname;
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
    console.log(response);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const RevokeAgreement = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.user.email;
    const org = req.user.orgname;
    const agreement_id = req.body.agreement_id;
    const isProvider = req.user.type === "Provider";
    console.log(
      agreement_id,
      isProvider,
      username,
      org,
      "RevokeAgreement",
      req.body
    );

    // GetAgreementByID
    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetAgreementByID",
      [agreement_id],
      username,
      org
    );
    console.log("respo", response);

    if (response != null) {
      console.log("inside if");
      const agreement = response;

      if (
        agreement.dataProvider === username ||
        agreement.dataConsumer === username
      ) {
        // Find payment by offer_request_id
        const payments = await Payment.find({
          offer_request_id: agreement.offer_request_id,
        });
        console.log("payments", payments);

        if (payments.length > 0) {
          for (const payment of payments) {
            console.log("payment", payment);

            if (payment.paymentStatus === "Refunded") {
              throw new Error("Payment already refunded");
            }

            try {
              const amount = payment.paymentAmount.toFixed(2);
              console.log(amount.toString(), "AMOUNT");
              console.log(payment.paymentId, "PAYMENTID");
              const payment_id = payment.paymentId;
              console.log(payment_id, "PAYMENTID");

              //Get payment¶
              const paymentData = await mollieClient.payments.get(
                payment_id as string
              );
              console.log(paymentData, "PAYMENT");

              const refund = await mollieClient.paymentRefunds.create({
                paymentId: payment.paymentId,
                amount: {
                  value: amount.toString(),
                  currency: process.env.CURRENCY as string,
                },
              });

              console.log(refund, "REFUND");

              if (refund) {
                payment.paymentStatus = "Refunded";
                payment.refund_amount = refund.amount.value;
                await payment.save();
              }
            } catch (error) {
              console.error(error);
              if (error.statusCode === 404) {
                throw new Error("Payment not found");
              } else {
                throw new Error("Failed to create refund");
              }
            }
          }

          const response = await invokeTransaction(
            CHANNEL,
            CHAINCODE,
            "RevokeAgreementNew",
            [agreement_id, isProvider],
            username,
            org
          );
          console.log(response);
          res.send(response);
        } else {
          throw new Error("No payments found");
        }
      }
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    next(error);
  }
};
