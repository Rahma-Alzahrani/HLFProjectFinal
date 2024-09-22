import { Router } from "express";
import {
  createOffer,
  getHistoricalOfferById,
  getOfferById,
  getAllOffers,
  updateOffer,
  getOfferHash,
  historicalDataOffer,
  updateHistoricalOffer,
  getAllHistoricalOffers,
} from "../controllers/offer";

const router = Router();
/**
 * @swagger
 * tags:
 *  name: Offers
 *  description: Offers endpoint
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      Offer:
 *       type: object
 *       required:
 *          -id
 *          -validity
 *          -dataOwner
 *          -equipment
 *          -monitoredAsset
 *          -processingLevel
 *          -price
 *          -deposit
 *       properties:
 *          id:
 *              type: string
 *              description: The auto-generated id of the offer.
 *          validity:
 *              type: boolean
 *              description: To inform consumers about the data availability
 *          dataOwner:
 *              type: string
 *              description: The data owner
 *          equipment:
 *              type: string
 *              description: The device used to generate data
 *          monitoredAsset:
 *              type: string
 *              description: The device this data is used to monitor
 *          processingLevel:
 *              type: string
 *              description: Processing level
 *          price:
 *              type: number
 *              description: The data price
 *          deposit:
 *              type: number
 *              description: The deposit amount
 *          creator:
 *              type: string
 *              description: The offer creator
 *          owner_org:
 *              type: string
 *              description: The Organization this provider is belonging to
 *       example:
 *        id: OFFER-12344
 *        validity: true
 *        dataOwner: Siemens@Providers.org
 *        equipment: RailBAM
 *        monitoredAsset: Axle journal bearing
 *        processingLevel: SD
 *        price: 200
 *        deposit: 200
 *        creator: Siemens@Providers.org
 *        owner_org: Org1MSP
 */

/**
 * @swagger
 * /api/v1/offer:
 *  get:
 *    summary: get all available Offers to the Consumer or the offers of specific Provider
 *    tags: [Offers]
 *    responses:
 *      200:
 *        description: List of all offers
 *        content:
 *          application/json:
 *             schema:
 *                type: array
 *                items:
 *                 $ref: '#/components/schemas/Offer'
 *      500:
 *        description: Error
 *      401:
 *        description : Error Unauthorized
 *  post:
 *      summary: Post new offer to the network
 *      tags: [Offers]
 *      requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Offer'
 *      responses:
 *       200:
 *          description: Sucsessfully new offer added
 *          content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                      txId:
 *                        type: string
 *                    example:
 *                      txId: 3be4f8e7678c87e275cd05b4688bfaa19e03b1ad09bdbd21edc18af1085eadc8
 *      401:
 *          description : Error Unauthorized
 *  put:
 *      summary: Update specific Offer by the Provider
 *      tags: [Offers]
 *      requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Offer'
 *      responses:
 *       200:
 *          description: The offer is updated
 *          content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                      txId:
 *                         type: string
 *                    example:
 *                      txId: ea85fc4ff1cdf4a7970497c202c228298f756f11445c64d6ec84b3618025a265
 *      401:
 *          description : Error Unauthorized
 * 
 * /api/v1/offer/offerById/{id}:
 *  get:
 *    summary: get specific Offer by id
 *    tags: [Offers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Offer id
 *    responses:
 *      200:
 *        description: The Offer description by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Offer'
 *      404:
 *        description: The Offer was not found
 *      401:
 *        description : Error Unauthorized
 *
 *
 */

/**
 * @swagger
 * tags:
 *  name: HistoricalOffer
 *  description: Historical Offers endpoint
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      HistoricalOffer:
 *       type: object
 *       required:
 *          -id
 *          -validity
 *          -data_owner
 *          -equipment
 *          -monitoredAsset
 *          -processing_level
 *          -price
 *          -deposit
 *          -operator
 *          -owner_org
 *          -start_date
 *          -end_date
 *          -multiple_offer_id
 *          -journey_uid
 *       properties:
 *          id:
 *              type: string
 *              description: The auto-generated id of the offer.
 *          validity:
 *              type: boolean
 *              description: To inform consumers about the data availability
 *          data_owner:
 *              type: string
 *              description: The data owner
 *          equipment:
 *              type: string
 *              description: The device used to generate data
 *          monitoredAsset:
 *              type: string
 *              description: The device this data is used to monitor
 *          processing_level:
 *              type: string
 *              description: Processing level
 *          price:
 *              type: number
 *              description: The data price
 *          deposit:
 *              type: number
 *              description: The deposit amount
 *          operator:
 *              type: string
 *              description: The offer operator
 *          owner_org:
 *              type: string
 *              description: The Organization this provider is belonging to
 *          start_date:
 *             type: string
 *             format: date-time
 *             description: The start date of the offer
 *          end_date:
 *            type: string
 *            format: date-time
 *            description: The end date of the offer
 *          multiple_offer_id:
 *            type: array
 *            items:
 *              type: string
 *              description: The offer id of the multiple offer
 *          journey_uid:
 *            type: string
 *            description: The journey id of the offer
 *       example:
 *        id: OFFER-12344
 *        validity: true
 *        data_owner: Siemens@Providers.org
 *        equipment: RailBAM
 *        monitoredAsset: Axle journal bearing
 *        processing_level: SD
 *        price: 200
 *        deposit: 200
 *        operator: Siemens@Providers.org
 *        owner_org: Org1MSP
 *        start_date: 2021-05-05T00:00:00.000Z
 *        end_date: 2021-05-05T00:00:00.000Z
 *        multiple_offer_id: [OFFER-12344,OFFER-12345]
 *        journey_uid: JOURNEY-12344
 */

/**
 * @swagger
 * /api/v1/offer/historicalDataOffer:
 *  post:
 *      summary: Post new historical offer to the network
 *      tags: [HistoricalOffer]
 *      requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/HistoricalOffer'
 *      responses:
 *       200:
 *          description: Sucsessfully new historical offer added
 *          content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                      txId:
 *                        type: string
 *                    example:
 *                      txId: 3be4f8e7678c87e275cd05b4688bfaa19e03b1ad09bdbd21edc18af1085eadc8
 *      401:
 *          description : Error Unauthorized
 *
 * /api/v1/offer/updateHistoricalOffer:
 *  put:
 *      summary: Update specific Historical Offer by the Provider
 *      tags: [HistoricalOffer]
 *      requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/HistoricalOffer'
 *      responses:
 *       200:
 *          description: The Historical offer is updated
 *          content:
 *               application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                      txId:
 *                         type: string
 *                    example:
 *                      txId: ea85fc4ff1cdf4a7970497c202c228298f756f11445c64d6ec84b3618025a265
 *      401:
 *          description : Error Unauthorized
 *
 * /api/v1/offer/getAllHistoricalOffers:
 *  get:
 *    summary: get all available Historical Offers to the Consumer or the Historical offers of specific Provider
 *    tags: [HistoricalOffer]
 *    responses:
 *      200:
 *        description: List of all offers
 *        content:
 *          application/json:
 *             schema:
 *                type: array
 *                items:
 *                 $ref: '#/components/schemas/Offer'
 *      500:
 *        description: Error
 *      401:
 *        description : Error Unauthorized
 * /api/v1/offer/getHistoricalOfferById/{id}:
 *  get:
 *    summary: get specific Historical Offer by id
 *    tags: [HistoricalOffer]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Historical Offer id
 *    responses:
 *      200:
 *        description: The Historical Offer description by id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/HistoricalOffer'
 *      404:
 *        description: The Historical Offer was not found
 *      401:
 *        description : Error Unauthorized
 *
 *
 */

router.post("/historicalDataOffer", historicalDataOffer);
router.post("/", createOffer);
router.get("/", getAllOffers);
router.put("/", updateOffer);
router.get("/offerById/:id", getOfferById);
router.get("/getHashDataByAssetId/:id/:offer_id", getOfferHash);
router.put("/updateHistoricalOffer", updateHistoricalOffer);
router.get("/getAllHistoricalOffers", getAllHistoricalOffers);
router.get("/getHistoricalOfferById/:id", getHistoricalOfferById);

export default router;
//$ref:'#/components/schemas/Offer'
