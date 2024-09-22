import dotenv from "dotenv";
import fs from "fs";
import logger from "./logger";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];
export const CHANNEL = process.env["CHANNEL"];
export const CHAINCODE = process.env["CHAINCODE"];
export const SMTP_HOST = process.env["SMTP_HOST"];
export const SMTP_USER = process.env["SMTP_USER"];
export const SMTP_PASSWORD = process.env["SMTP_PASSWORD"];

export const OFFERREQUEST_REJECTED = "OFFERREQUEST_REJECTED";


export const ErrorMSG = {
    INVALID_USER: "Invalid Username Or Password"
};

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    if (prod) {
        logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    } else {
        logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
    }
    process.exit(1);
}

export const emailTemplates = [

    { "subject": "Offer Request Rejected", "html": "    <p>Hi,</p>     <p>         Your offer request ({{REQUEST_ID}}) <span style=\"color:red\"><b>REJECTED</b></span> against offer ID         <b>{{OFFER_ID}}</b> is rejected by the provider     </p>", "emailType": "OFFERREQUEST_REJECTED" }

];