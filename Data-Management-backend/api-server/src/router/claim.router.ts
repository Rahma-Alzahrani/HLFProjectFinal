import express from "express";
import { falsifyClaim, latencyClaim,createClaimPeriod,getClaimPeriod,missingClaim } from "../controllers/claims";

/**
 * @swagger
 * tags:
 *  name: Claims
 *  description: Claims endpoint
 */
/**
 * @swagger
 * /api/v1/claim/latencyClaim:
 *  post:
 *      summary: Raise a frequency claim
 *      tags: [Claims]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                       offerId:
 *                          type: string
 *                       agreementId:
 *                          type: string
 *                      example:
 *                       offerId: OFFER-H0612SQQ202167RA898
 *                       agreementId: 952YFZQNNMQ8T5XW01FTEB8JFT
 *      responses:
 *        200:
 *          description: Frequency claim is reaised and the result will be reflected on the costs attribution
 * 
 * 
 * /api/v1/claim/falsifyClaim:
 *  post:
 *      summary: Raise a falsified data claim 
 *      tags: [Claims] 
 *      requestBody: 
 *          required: true
 *          content:   
 *              application/json:  
 *                schema:
 *                  type: object  
 *                  items:
 *                    fileName:
 *                      type: array
 *                    offerId:
 *                      type: string
 *                    agreementId:
 *                      type: string  
 *                  example:
 *                       fileName: [839bb1e6d72a3733681a174a911c07bc.png]
 *                       offerId: OFFER-H0612SQQ202167RA898
 *                       agreementId: 0FYH9PYRJD5XBC6101FTEK0A89
 *                                       
 *      responses:
 *        200:
 *          description: Falsified claim is reaised and the result will be reflected on the cost attribution
 * 
 */

// claimPeriodHours: number;
//   claimPeriodMinutes: number;
//   claimPeriodStatus: boolean;
//   claimPeriodCreated: boolean;
/**
 * @swagger
 * components:
 *   schemas:
 *    ClaimManagement:
 *     type: object

 *     properties:
 *        claimPeriodHours:
 *           type: number
 *           description: the claim period hours
 *        claimPeriodMinutes:
 *           type: number
 *           description: the claim period minutes
 *        claimPeriodStatus:
 *           type: boolean
 *           description: the claim period status
 *        claimPeriodCreated:
 *           type: boolean
 *           description: the claim period created
 *     example:
 *       claimPeriodHours: 24
 *       claimPeriodMinutes: 0
 *       claimPeriodStatus: true
 *       claimPeriodCreated: true
 * 
 */


/**
 * @swagger
 * tags:
 *  name: Claims (Time Management)
 *  description: Claim Time Management endpoint
 */
/**
 * @swagger
 * /api/v1/claim/createClaimPeriod:
 *  post:
 *      summary: Create a claim period
 *      tags: [Claims (Time Management)]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                       claimPeriodHours:
 *                          type: number
 *                       claimPeriodMinutes:
 *                          type: number
 *                      example:
 *                       claimPeriodHours: 24
 *                       claimPeriodMinutes: 0
 *      responses:
 *        200:
 *          description: Claim period is created and the result will be reflected on the admin dashboard
 * 
 * 
 *  get:
 *      summary: Get the current claim period
 *      tags: [Claims (Time Management)]               
 *      responses:
 *        200:
 *          description: The current claim period
 *          content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ClaimManagement' 
 *      500:
 *        description: Error 
 *      401:
 *        description : Error Unauthorized 
 * 
 */



const claimRouter = express.Router();

claimRouter.post("/latencyClaim", latencyClaim);
claimRouter.post("/falsifyClaim", falsifyClaim);
claimRouter.post("/createClaimPeriod", createClaimPeriod);
claimRouter.get("/createClaimPeriod", getClaimPeriod);
claimRouter.post("/missingClaim", missingClaim);
export default claimRouter;