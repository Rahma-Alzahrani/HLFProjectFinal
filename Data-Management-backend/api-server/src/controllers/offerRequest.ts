import { Agenda } from "agenda";
import { NextFunction, Response } from "express";
import moment from "moment";
import { ReqUser } from "request-types";
import logger from "../util/logger";
import { ulid as v4 } from "ulid";
import { sendMail } from "../util/email";
import invokeTransaction from "../util/invoke";
import queryLedger from "../util/query";
import { CHAINCODE, CHANNEL, OFFERREQUEST_REJECTED } from "../util/secrets";
const mongoConnectionString = "mongodb://127.0.0.1/agenda";
import { ClaimPeriod } from "../models/Claim-period";
import { SendRequestPayload } from "../models/Send-Request-PayloadData";
import { User } from "../models/User";
import { Payment } from "../models/Payment";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { forEach } from "async";

// this is added to the mongodb in agenda
const agenda = new Agenda({ db: { address: mongoConnectionString } });
import createMollieClient from "@mollie/api-client";
const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY as string,
});

export const createOfferRequest = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payment_id } = req.body;
    console.log(payment_id, "PAYMENT ID");
    const payload = req.body;
    payload["dataConsumer"] = req.user.email;
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    payload["offer_request_id"] = v4();

    //find SendRequestPayload data
    const payloadData = await SendRequestPayload.findById(payment_id);
    console.log(payloadData, "PAYLOAD DATA");
    // format time 2023-06-29T01:54:00.000Z to 2023-06-29 01:54
    console.log(payloadData["startDate"], "START DATE");
    // const startTimestamp = moment(payloadData["startDate"]).format(
    //   "YYYY-MM-DD HH:mm"
    // );

    //add 1 hour to startTimestamp
    const startTimestamp = moment(payloadData["startDate"]).format(
      "YYYY-MM-DD HH:mm"
    );
    console.log(startTimestamp, "START TIMESTAMP");
    const endTimestamp = moment(payloadData["endDate"]).format(
      "YYYY-MM-DD HH:mm"
    );
    console.log(endTimestamp, "END TIMESTAMP");
    //add 1 hour to startTimestamp
    // const endTimestamp = moment(payloadData["endDate"]).add(1, "hours").format("YYYY-MM-DD HH:mm");
    // console.log(endTimestamp, "END TIMESTAMP");
    // create new payload
    const newPayload = {
      offer_id: payloadData["offer_id"],
      price: payloadData["price"],
      cDeposit: payloadData["cDeposit"],
      // startDate: startTimestamp,
      // endDate: endTimestamp,
      dataConsumer: payloadData["dataConsumer"],
      offer_request_id: payloadData["offer_request_id"],
      is_active: false,
    };
    console.log(newPayload, "NEW PAYLOAD");
    const payment = await Payment.findOneAndUpdate(
      { offer_request_id: payloadData["offer_request_id"] },
      {
        $set: {
          paymentStatus: "PAID",
          paymentDate: new Date(),
        },
      },
      { new: true }
    );
    console.log(payment, "PAYMENT");
    if (!payment) {
      throw new Error("Payment not found");
    }
    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "CreateOfferRequest2",
      JSON.stringify(newPayload),
      username,
      org
    );
    //delete SendRequestPayload data
    await SendRequestPayload.findByIdAndDelete(payment_id);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const createOfferRequestPayment = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    function generateShortId(): string {
      const uuid = uuidv4();
      const shortId = uuid.replace(/-/g, "").substring(0, 6);
      return shortId;
    }
    const shortId = generateShortId();
    const payload = req.body;
    console.log(payload, "PAYLOAD");
    payload["dataConsumer"] = req.user.email;
    const username = req.user.email;
    const orgname = req.user.type;
    const org = req.user.orgname;
    payload["offer_request_id"] = v4();
    console.log(payload, "PAYLOAD");

    const SendRequest = new SendRequestPayload({
      offer_id: payload.offer_id,
      offer_request_id: payload.offer_request_id,
      dataConsumer: payload.dataConsumer,
      startDate: payload.startDate,
      endDate: payload.endDate,
      cDeposit: payload.cDeposit,
      price: payload.price,
    });
    await SendRequest.save();

    console.log(SendRequest, "SEND REQUEST");

    const user = await User.findOne({ email: username });
    if (!user) {
      throw new Error("User not found");
    }
    const { cDeposit, price } = payload;
    const total = parseInt(cDeposit) + parseInt(price);
    console.log(total, "TOTAL");
    let totalString = total.toString();
    //check if total not decimal then add 00
    if (total % 1 === 0) {
      totalString = total + ".00";
    }
    console.log(totalString, "TOTAL");

    const paymentMollie = await mollieClient.payments.create({
      amount: {
        currency: process.env.CURRENCY as string,
        value: totalString, // You must send the correct number of decimals, thus we enforce the use of strings
      },
      description: `Payment for ${payload.offer_id}`,
      redirectUrl: `http://localhost:4200/home/send-requests?payment_id=${SendRequest._id}&status=true`,
      webhookUrl: "https://webshop.example.org/payments/webhook/",
      metadata: {
        order_id: `${shortId}`,
      },
    });
    console.log(paymentMollie, "PAYMENT");
    const payment = new Payment({
      customerId: user._id,
      paymentId: paymentMollie.id,
      paymentStatus: paymentMollie.status,
      paymentAmount: total,
      paymentCurrency: paymentMollie.amount.currency,
      paymentDate: new Date(),
      paymentMethod: paymentMollie.method,
      paymentDescription: "Payment for offer request",
      profileId: paymentMollie.profileId,
      // paymentProvider: false,
      // paymentConsumer: true,
      paymentUserRole: "Consumer",
      order_id: shortId,
      offer_request_id: payload.offer_request_id,
      // paymentPaidAmount: sdkResponse.payment.paidAmount,
      // paymentRefundedAmount: sdkResponse.payment.refundedAmount,
      // paymentCardCountryCode: sdkResponse.payment.countryCode,
    });
    payment.save();

    res.send(paymentMollie);
  } catch (error) {
    next(error);
  }
};

export const getAllOfferRequest = async (
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
      "GetAllOfferRequest",
      "",
      username,
      org
    );

    const filterkey = orgname == "Provider" ? "dataProvider" : "dataConsumer";
    const r = response.filter((item: any) => item[filterkey] == username);

    res.send(r);
  } catch (error) {
    next(error);
  }
};

export const acceptRejectOfferRequest = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payment_id } = req.body;
    console.log(payment_id, "PAYMENT ID");
    //find SendRequestPayload data
    const payloadData = await SendRequestPayload.findById(payment_id);
    console.log(payloadData, "PAYLOAD DATA");

    if (!payloadData) {
      throw new Error("Aggrement not Accepted");
    }

    console.log(req.body, "BODY");
    const orgname = req.user.type;
    const org = req.user.orgname;
    const offerID = payloadData["offer_id"];
    const offerRequestID = payloadData["offer_request_id"];
    const isAccepted = req.body.isAccepted;
    const monitered_asset = payloadData["monitered_asset"];
    console.log(monitered_asset, "MONITERED ASSET");

    const username = req.user.email;
    const payload = [offerID, offerRequestID, isAccepted];

    console.log(payload, "PAYLOAD");
    console.log(username, "USERNAME", org, "ORG", orgname, "ORGNAME");

    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "AcceptOfferRequest",
      payload,
      username,
      org
    );

    const offerRequest = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetOfferRequestByID",
      offerRequestID,
      username,
      org
    );

    if (isAccepted) {
      offerRequest["username"] = username;
      offerRequest["orgname"] = org;
      await ClearAgreement(offerRequest);

      const endDate = moment
    .utc(offerRequest.offer_details.arrival_time)
    .add(5, "minutes").toDate();
  console.log("endDate :", endDate);
  const startDate = moment
    .utc(offerRequest.offer_details.depart_time)
    .subtract(5, "minutes").toDate();
  console.log("startDate :", startDate);

      const fileDocs = await mongoose.connection.db
        .collection("uploads.files")
        .find({ device_id: monitered_asset, uploadDate: { $gte: startDate, $lte: endDate } })
        .toArray();

      console.log(fileDocs);
      if (fileDocs.length > 0) {
        forEach(fileDocs, async (fileDoc) => {
          const hash = fileDoc.hash;
          const start = fileDoc.start_time;
          const end = fileDoc.uploadDate;
          console.log("start :", start);
          console.log("end :", end);
          // console.log("moment.utc(start)", moment.utc(start));
          console.log(
            "new Date(start)",
            new Date("2023-08-11T13:03:34.253+00:00")
          );
          console.log(
            "new Date(end)",
            new Date("2023-08-11T13:03:35.947+00:00")
          );

          console.log(
            "new Date(end).toISOString() <= endDate.toISOString()",
            new Date(end).toISOString() <= endDate.toISOString()
          );
          console.log(
            "new Date(start).toISOString() >= startDate.toISOString()",
            new Date(start).toISOString() >= startDate.toISOString()
          );

          if (
            new Date(start).toISOString() >= startDate.toISOString() &&
            new Date(end).toISOString() <= endDate.toISOString()
          ) {
            console.log("Not Null");
            const hash_id = generate_HASH_ID();
            console.log(hash_id);
            const offerId = offerID;
            const hashID = hash_id;
            const dataHash = hash;
            const filename = fileDoc.filename;
            const entrydate = moment()
              .utc()
              .format("YYYY-MM-DD HH:mm");
            const offerDataHashID = v4();

            const payload2 = [
              offerId,
              hashID,
              dataHash,
              filename,
              entrydate,
              offerDataHashID,
            ];
            console.log(payload2);

            const responsenew = await invokeTransaction(
              CHANNEL,
              CHAINCODE,
              "InsertDataHash",
              payload2,
              username,
              org
            );
            console.log("hash created", responsenew);
          }

          // console.log("hashaa :", hash);
        });
      }
    } else {
      await sendMail({
        emailType: OFFERREQUEST_REJECTED,
        payload: {
          REQUEST_ID: offerRequestID,
          OFFER_ID: offerID,
        },
        to: offerRequest.dataConsumer,
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { offer_request_id: offerRequestID },
      {
        $set: {
          paymentStatus: "PAID",
          paymentDate: new Date(),
        },
      },
      { new: true }
    );
    console.log(payment, "PAYMENT");
    if (!payment) {
      throw new Error("Payment not found");
    }
    //delete payload
    await SendRequestPayload.findByIdAndDelete(payment_id);
    res.send(response);
  } catch (error) {
    next(error);
  }
};

export const acceptRejectOfferRequestPayment = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body, "BODY");

    const orgname = req.user.type;
    const org = req.user.orgname;
    const offerID = req.body.offerID;
    const offerRequestID = req.body.offerRequestID;
    const isAccepted = req.body.isAccepted;

    const username = req.user.email;
    const payload = [offerID, offerRequestID, isAccepted];
    console.log(payload, "PAYLOAD");

    const response = await queryLedger(
      CHANNEL,
      CHAINCODE,
      "GetOfferRequestByID",
      offerRequestID,
      username,
      org
    );
    console.log(response, "RESPONSE");

    const fileDoc = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ device_id: response.offer_details.monitered_asset });
    console.log(fileDoc);

    // if (fileDoc || isAccepted == false) {
    console.log("Not Null");
    function generateShortId(): string {
      const uuid = uuidv4();
      const shortId = uuid.replace(/-/g, "").substring(0, 6);
      return shortId;
    }
    const shortId = generateShortId();
    console.log(shortId, "SHORTID");
    const newPayload = {
      offerID: offerID,
      offerRequestID: offerRequestID,
      isAccepted: isAccepted,
      dataConsumer: username,
      // startDate: response.startDate,
      // endDate: response.endDate,
      cDeposit: response.cDeposit,
      price: response.price,
      monitered_asset: response.offer_details.monitered_asset,
    };
    console.log(newPayload, "NEW PAYLOAD");
    // console.log(newPayload, "NEW PAYLOAD", payload, "PAYLOAD");
    const acceptRejectData = new SendRequestPayload({
      offer_id: newPayload.offerID,
      offer_request_id: newPayload.offerRequestID,
      dataConsumer: newPayload.dataConsumer,
      // startDate: newPayload.startDate,
      // endDate: newPayload.endDate,
      cDeposit: newPayload.cDeposit,
      price: newPayload.price,
      monitered_asset: newPayload.monitered_asset,
    });
    await acceptRejectData.save();

    console.log(acceptRejectData, "SEND REQUEST");

    const user = await User.findOne({ email: response.dataProvider });
    if (!user) {
      throw new Error("User not found");
    }
    console.log(user, "USER");

    const { cDeposit, price } = response;
    if (isAccepted) {
      const total = parseInt(cDeposit);
      console.log(total, "TOTAL");
      let totalString = total.toString();
      //check if total not decimal then add 00
      if (total % 1 === 0) {
        totalString = total + ".00";
      }
      console.log(totalString, "TOTAL");

      const paymentMollie = await mollieClient.payments.create({
        amount: {
          currency: process.env.CURRENCY as string,
          value: totalString, // You must send the correct number of decimals, thus we enforce the use of strings
        },
        description: `Payment for ${newPayload.offerID}`,
        redirectUrl: `http://localhost:4200/home/requests?payment_id=${acceptRejectData._id}&isAccepted=${isAccepted}`,
        webhookUrl: "https://webshop.example.org/payments/webhook/",
        metadata: {
          order_id: `${shortId}`,
        },
      });
      console.log(paymentMollie, "PAYMENT");
      const payment = new Payment({
        customerId: user._id,
        paymentId: paymentMollie.id,
        paymentStatus: paymentMollie.status,
        paymentAmount: total,
        paymentCurrency: paymentMollie.amount.currency,
        paymentDate: new Date(),
        paymentMethod: paymentMollie.method,
        paymentDescription: "Payment for offer request",
        profileId: paymentMollie.profileId,
        // paymentProvider: false,
        // paymentConsumer: true,
        paymentUserRole: "Provider",
        order_id: shortId,
        offer_request_id: newPayload.offerRequestID,
        // paymentPaidAmount: sdkResponse.payment.paidAmount,
        // paymentRefundedAmount: sdkResponse.payment.refundedAmount,
        // paymentCardCountryCode: sdkResponse.payment.countryCode,
      });
      payment.save();

      res.send(paymentMollie);
    } else {
      const total = parseInt(cDeposit) + parseInt(price);
      console.log(total, "TOTAL");
      let totalString = total.toString();
      //check if total not decimal then add 00
      if (total % 1 === 0) {
        totalString = total + ".00";
      }
      console.log(totalString, "TOTAL");
      //find Payment by offer_request_id
      const findPayment = await Payment.findOne({
        offer_request_id: offerRequestID,
      });
      console.log(findPayment, "FIND PAYMENT");
      if (!findPayment) {
        throw new Error("Payment not found");
      }
      if (findPayment.paymentStatus === "Refunded") {
        throw new Error("Payment already refunded");
      }
      const refund = await mollieClient.paymentRefunds.create({
        paymentId: findPayment.paymentId,
        amount: {
          value: totalString,
          currency: process.env.CURRENCY as string,
        },
      });
      console.log(refund, "REFUND");
      if (refund) {
        findPayment.paymentStatus = "Refunded";
        findPayment.refund_amount = refund.amount.value;
        await findPayment.save();
      }
      const response = await invokeTransaction(
        CHANNEL,
        CHAINCODE,
        "AcceptOfferRequest",
        payload,
        username,
        org
      );

      const offerRequest = await queryLedger(
        CHANNEL,
        CHAINCODE,
        "GetOfferRequestByID",
        offerRequestID,
        username,
        org
      );
      if (isAccepted) {
        offerRequest["username"] = username;
        offerRequest["orgname"] = org;
        await ClearAgreement(offerRequest);
      } else {
        await sendMail({
          emailType: OFFERREQUEST_REJECTED,
          payload: {
            REQUEST_ID: offerRequestID,
            OFFER_ID: offerID,
          },
          to: offerRequest.dataConsumer,
        });
      }
      //delete from sendrequestpayload
      await SendRequestPayload.deleteOne({ offer_id: offerID });
      res.send(response);
    }
  } catch (error) {
    next(error);
  }
};

//
async function ClearAgreement(offerRequest: any) {
  //find all claimperiods
  const claimPeriods = await ClaimPeriod.find();
  const date = offerRequest.endDate;
  console.log("claimPeriods", claimPeriods);
  console.log("date", offerRequest);

  if (claimPeriods.length === 0) {
    console.log("WAAHH");
    // const newDate = convertUTCDate(offerRequest.endDate);
    // console.log("date=", newDate);

    await agenda.start();
    console.log("ReleaseEscrdateToCronow Job :", offerRequest);
    const newDate = convertUTCDate(offerRequest.endDate);
    console.log("date=", newDate);
    await agenda.schedule(newDate, "close agreement", offerRequest);
  } else {
    console.log("WAAHH WAAHH");
    const hours = claimPeriods[0].claimPeriodHours;
    const minutes = claimPeriods[0].claimPeriodMinutes;
    const h1: string = hours < 10 ? "0" + hours : `${hours}`;
    const m1: string = minutes < 10 ? "0" + minutes : `${minutes}`;

    const timeData = new Date(date);
    timeData.setUTCHours(
      timeData.getHours() + parseInt(h1),
      timeData.getMinutes() + parseInt(m1),
      parseInt("00"),
      0
    );

    const format = "YYYY-MM-DD HH:mm";
    const convertUTCDateTime = (date: any) => {
      return moment.utc(date).format(format);
    };

    const utc = convertUTCDateTime(timeData);
    console.log("utc", utc);

    const date1 = moment(utc);

    // Extract date and time parts
    const formattedDate = date1.format("YYYY-MM-DD");
    const formattedTime = date1.format("HH:mm:ss");
    const formattedOffset = date1.format("Z"); // Offset like +05:30

    // Combine date, time, and offset
    const combinedDateTime = `${formattedDate}T${formattedTime}${formattedOffset}`;

    console.log("Combined date and time:", combinedDateTime);
    const newDate = convertUTCDate(utc);
    console.log("date=", newDate);
    // const Date1 = new Date(utc);
    // console.log("Date1", Date1);

    await agenda.start();
    console.log("ReleaseEscrdateToCronow Job :", offerRequest);
    // const newDate = utc;
    console.log("date=", newDate);
    await agenda.schedule(newDate, "close agreement", offerRequest);
  }
}

agenda.define(
  "release datahash to cronow",
  { concurrency: 1 },
  async (job: any, done: any) => {
    const releaseCostID = v4();
    const data = job.attrs.data;
    console.log("done:", done);
    console.log("data ====>", data);
    job.save();

    const fileDocs = await mongoose.connection.db
      .collection("uploads.files")
      .find({ device_id: data.offer_details.monitered_asset })
      .toArray();

    console.log(fileDocs);

    const fileDoc = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ device_id: data.offer_details.monitered_asset });
    console.log(fileDoc, "doc");

    if (fileDoc != null) {
      console.log("Not Null");
      const hash_id = generate_HASH_ID();
      console.log(hash_id);
      const offerId = data.offer_id;
      const hashID = hash_id;
      const dataHash = fileDoc.md5;
      const filename = fileDoc.filename;
      const entrydate = moment()
        .utc()
        .format("YYYY-MM-DD HH:mm");
      const offerDataHashID = v4();
      console.log(
        "zzzzzzzzzzzzzzzzzzzz",
        offerId,
        hashID,
        dataHash,
        filename,
        entrydate,
        offerDataHashID
      );
      const payload2 = [
        offerId,
        hashID,
        dataHash,
        filename,
        entrydate,
        offerDataHashID,
      ];
      console.log(payload2);

      console.log("data.username", data.username, data.orgname);

      const responsenew = await invokeTransaction(
        CHANNEL,
        CHAINCODE,
        "InsertDataHash",
        payload2,
        data.username,
        data.orgname
      );
      console.log("hash created", responsenew);
    }

    job.save();
    done();
  }
);

agenda.define(
  "close agreement",
  { concurrency: 1 },
  async (job: any, done: any) => {
    const releaseCostID = v4();
    const data = job.attrs.data;
    console.log("done:", done);
    console.log("data ====>", data);
    let hours = 0;
    let minutes = 0;
    const claimPeriods = await ClaimPeriod.find();
    console.log("claimPeriods", claimPeriods);
    if (claimPeriods.length > 0) {
      const hoursData = claimPeriods[0].claimPeriodHours;
      const minutesData = claimPeriods[0].claimPeriodMinutes;
      const h1: string = hoursData < 10 ? "0" + hoursData : `${hoursData}`;
      const m1: string =
        minutesData < 10 ? "0" + minutesData : `${minutesData}`;
      hours = parseInt(h1);
      minutes = parseInt(m1);
      console.log("hour", hours);
      console.log("minute", minutes);
    }

    console.log("hours", hours, "minutes", minutes);

    job.save();
    const response = await invokeTransaction(
      CHANNEL,
      CHAINCODE,
      "ReleaseEscrow2",
      [data.escrow_id, releaseCostID, hours, minutes],
      data.username,
      data.orgname
    );
    job.save();
    done();
  }
);

function convertUTCDate(date: string) {
  const localDatetime = moment(date + "+00:00").format("YYYY-MM-DD HH:mm:ss");
  return moment.utc(moment(localDatetime).utc()).format();
}

function generate_HASH_ID() {
  const currentDate = new Date();
  const hash_key = `xxxxx-xxxx${formatDate(
    currentDate,
    "ddMM"
  )}xxxxxx-xxx${formatDate(currentDate, "yy")}xxxxxx-xxxxxx`;
  let dtd = currentDate.getTime();
  return hash_key.replace(/[xy]/g, (cached) => {
    const rKey = (dtd + Math.random() * 999) % 32 | 0;
    dtd = Math.floor(dtd / 32);
    return (cached == "x" ? rKey : (rKey & 0x3) | 0x8).toString(32);
  });
}

function formatDate(date: any, format: any) {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date
      .getFullYear()
      .toString()
      .slice(-2),
    yyyy: date.getFullYear(),
  };
  return format.replace(/mm|dd|yy|yyy/gi, (matched) => map[matched]);
}
