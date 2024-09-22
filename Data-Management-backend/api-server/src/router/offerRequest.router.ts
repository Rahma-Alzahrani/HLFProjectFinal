import { Router } from "express";
import { acceptRejectOfferRequest, acceptRejectOfferRequestPayment ,createOfferRequestPayment, createOfferRequest, getAllOfferRequest } from "../controllers/offerRequest";

const router = Router();
/**
 * @swagger
 * tags:
 *  name: Offer-Request
 *  description: proccesing the data requests endpoint
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      Request:
 *       type: object
 *       required:
 *          -offer_id
 *          -startDate
 *          -endDate
 *          -cDeposit
 *          -price
 *       properties:
 *          offer_id:
 *              type: string
 *              description: The id of the offer.
 *          startDate:
 *              type: string
 *              format: date-time
 *              description: The starting time of sharing data process
 *          endDate:
 *              type: string
 *              format: date-time
 *              description: The ending time of sharing data process
 *          cDeposit:
 *              type: number
 *              description: The deposit amount
 *          price:
 *              type: number
 *              description: The data price
 *       example:
 *        offer_id: OFFER-12344
 *        startDate: 2022-1-06 12:10
 *        endDate: 2022-1-06 12:30
 *        cDeposit: 1000
 *        price: 1000
 * 
 *      Request-Response:
 *       type: object
 *       required:
 *          -offerID
 *          -offerRequestID
 *          -isAccepted
 *       properties:
 *          offerID:
 *              type: string
 *              description: The id of the offer.
 *          offerRequestID:
 *              type: string
 *              description: The id of the request
 *          isAccepted:
 *              type: boolean
 *       example:
 *        offerID: OFFER-12344
 *        offerRequestID: 01FP7T8QS8NYA9TS81EB53AM4H
 *        isAccepted: true
 */

/**
 * @swagger
 * /api/v1/offerRequest:
 *  post:
 *      summary: Send a request to the provider and initiate an escrow with the deposit and data payment
 *      tags: [Offer-Request]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Request'
 *      responses:
 *        200:
 *          description: Sucsessfully new request has been sent
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                          Offer Request ID: 
 *                              type: string
 *                          Escrow ID:
 *                              type: string
 *                          txId:
 *                              type :string
 *                      example:
 *                          Offer Request ID: 01FS22NB5GQ3S5R7AVNTST4T4N
 *                          Escrow ID: 2NB5GQ3S5R7AVNTST4T4N01FS2
 *                          txId: d10d2e811c05b5fc8767e55f705d20781be6eefae70177b934a9f23e7da7000f
 * 
 *  get:
 *      summary: Get all received or sent requests
 *      tags: [Offer-Request]
 *      responses:
 *       200:
 *        description: List of all Requests
 *        content:
 *          application/json:
 *             schema:
 *                type: array
 *                items:
 *                 $ref: '#/components/schemas/Request'   
 *       500:
 *        description: Error 
 *       401:
 *        description : Error Unauthorized
 * 
 * /api/v1/offerRequest/acceptReject:
 *  post:
 *      summary: Accept or Reject the requests
 *      tags: [Offer-Request]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Request-Response'
 *      responses:
 *        200:
 *          description: Sucsessfully responded
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                          agreement-id:
 *                              type: string
 * 
 */

router.post("/", createOfferRequest);
router.post("/payments", createOfferRequestPayment);

router.get("/", getAllOfferRequest);
router.post("/acceptReject", acceptRejectOfferRequest);
router.post("/acceptReject/payments", acceptRejectOfferRequestPayment);

export default router;