import { Router } from "express";
import {
  journeySchedule,
  getAllJourney,
  updateJourneySchedule,
  getJourneyByUID,
} from "../controllers/journey";

const router = Router();

// this.journeyData = this.journeyForm.value;
// this.journeyData.valid_from = this.journeyForm.controls.valid_from.value;
// this.journeyData.valid_to = this.journeyForm.controls.valid_to.value;
// this.journeyData.uid = this.journeyForm.controls.uid.value;
// this.journeyData.type = this.journeyForm.controls.type.value;
// this.journeyData.cat = this.journeyForm.controls.cat.value;
// this.journeyData.journey = this.journeyForm.controls.journey.value;
// this.journeyData.days = this.journeyForm.controls.days.value.toString();
// this.journeyData.operator = this.journeyForm.controls.operator.value;
// this.journeyData.valid_from = this.journeyForm.controls.valid_from.value;
// this.journeyData.valid_to = this.journeyForm.controls.valid_to.value;

/**
 * @swagger
 * tags:
 *  name: Journey
 *  description: The Journey managing API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Journey:
 *       type: object
 *       required:
 *         -valid_from
 *         -valid_to
 *         -journey
 *         -operator
 *         -type
 *         -cat
 *         -uid
 *         -days
 *       properties:
 *          valid_from:
 *              type: string
 *              description: The date from which the journey is valid
 *          valid_to:
 *              type: string
 *              description: The date till which the journey is valid
 *          journey:
 *              type: string
 *              description: The journey name
 *          operator:
 *              type: string
 *              description: The operator name
 *          type:
 *              type: string
 *              description: The type of the journey
 *          cat:
 *              type: string
 *              description: The category of the journey
 *          uid:
 *              type: string
 *              description: The uid of the journey
 *          days:
 *              type: string
 *              description: The number of days of the journey
 *       example:
 *         valid_from: 2023-09-04T07:09:19.661Z
 *         valid_to: 2023-09-30T07:09:21.000Z
 *         journey: Journey 1
 *         operator: Operator 1
 *         type: Type 1
 *         cat: Cat 1
 *         uid: U1
 *         days: '27'
 */

/**
 * @swagger
 * /api/v1/journey/journeySchedule:
 *  post:
 *    summary: Create a new journey schedule
 *    tags: [Journey]
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *            schema:
 *                $ref: '#/components/schemas/Journey'
 *    responses:
 *     200:
 *        description: Post journey schedule to the network
 *        content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  items:
 *                    txId:
 *                      type: string
 *                  example:
 *                    txId: 597a3e2fddfa3394f2495e540830be935d6511b890599cff008432979c60fb67
 *    401:
 *        description : Error Unauthorized
 *
 * /api/v1/journey/getAllJourney:
 *  get:
 *    summary: Get all journey schedule
 *    tags: [Journey]
 *    responses:
 *     200:
 *        description: Get all journey schedule from the network
 *        content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Offer'
 *     404:
 *        description: The Offer was not found
 *     401:
 *        description: Error Unauthorized
 *
 * components:
 *   schemas:
 *     Offer:
 *       type: object
 *       required:
 *         - id
 *         - validity
 *         - dataOwner
 *         - equipment
 *         - monitoredAsset
 *         - processingLevel
 *         - price
 *         - deposit
 *         - creator
 *         - owner_org
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the offer.
 *         validity:
 *           type: boolean
 *           description: To inform consumers about the data availability.
 *         dataOwner:
 *           type: string
 *           description: The data owner.
 *         equipment:
 *           type: string
 *           description: The device used to generate data.
 *         monitoredAsset:
 *           type: string
 *           description: The device this data is used to monitor.
 *         processingLevel:
 *           type: string
 *           description: Processing level.
 *         price:
 *           type: number
 *           description: The data price.
 *         deposit:
 *           type: number
 *           description: The deposit amount.
 *         creator:
 *           type: string
 *           description: The offer creator.
 *         owner_org:
 *           type: string
 *           description: The Organization this provider is belonging to.
 *       example:
 *         id: OFFER-12344
 *         validity: true
 *         dataOwner: Siemens@Providers.org
 *         equipment: RailBAM
 *         monitoredAsset: Axle journal bearing
 *         processingLevel: SD
 *         price: 200
 *         deposit: 200
 *         creator: Siemens@Providers.org
 *         owner_org: Org1MSP
 *
 * /api/v1/journey/getJourneyByUID:
 *  get:
 *    summary: Get journey schedule by UID
 *    tags: [Journey]
 *    parameters:
 *      - in: query
 *        name: uid
 *        schema:
 *          type: string
 *        required: true
 *        description: The UID of the journey to retrieve.
 *    responses:
 *      200:
 *        description: Journey schedule found successfully.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Journey'
 *      404:
 *        description: Journey with the provided UID was not found.
 *      401:
 *        description: Unauthorized error.
 *
 * /api/v1/journey/updateJourneySchedule:
 *  put:
 *    summary: Update journey schedule
 *    tags: [Journey]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Journey'
 *    responses:
 *      200:
 *        description: Journey schedule updated successfully.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A success message.
 *                journey:
 *                  $ref: '#/components/schemas/Journey'
 *      400:
 *        description: Bad request, invalid input data.
 *      404:
 *        description: Journey schedule not found.
 *      401:
 *        description: Unauthorized error.
 */

router.post("/journeySchedule", journeySchedule);
router.get("/getAllJourney", getAllJourney);
router.put("/updateJourneySchedule", updateJourneySchedule);
router.get("/getJourneyByUID", getJourneyByUID);

export default router;
