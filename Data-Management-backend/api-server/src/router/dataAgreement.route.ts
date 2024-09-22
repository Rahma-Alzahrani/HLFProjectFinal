import { Router } from "express";
import { GetAllAgreements, RevokeAgreement } from "../controllers/dataAgreement";
/**
 * @swagger
 * tags:
 *  name: Data Agreements
 *  description: Data Agreements endpoint
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      dataAgreements:
 *       type: object
 *       required:
 *          -price
 *          -id
 *          -dataProvider
 *          -dataConsumer
 *          -escrow_id
 *       properties:
 *          price:
 *           type: number  
 *           description: The data price
 *          id: 
 *           type: string
 *           description: The Agreement id to identify the agreement in the docType 'Data_Agreement'
 *          dataProvider:
 *           type: string
 *           description: The data provider
 *          dataConsumer:
 *           type: string
 *           description: The data consumer
 *          escrow_id:
 *           type: string
 *           description: The escrow id in the docType 'Escrow'
 *          state:
 *           type: boolean
 *           description: The agreement state (true or false)
 *          offer_request_id:
 *           type: string
 *           description: The offer request id in the doctype 'offer_request'
 *          offer_id:
 *           type: string
 *           description: The offer id in the doctype 'data_offer'
 *          start_date:
 *           type: string
 *           format: date-time
 *           description: The agreement starting date 
 *          end_date:
 *           type: string
 *           format: date-time 
 *           description: The agreement ending date
 *          offer_data_hash_id:
 *           type: array
 *           items:
 *            type: string
 *            description: All hashes ids of this agreement
 *          providerDeposit:
 *           type: number
 *           description: The provider deposit
 *          consumerDeposit:
 *           type: number
 *           description: The consumer deposit
 *       example: 
 *          price: 1000
 *          id: N7H1WCM3NPN97RA701FP7X7ADK
 *          dataConsumer: First.Great.Western@Consumers.org
 *          dataProvider: Siemens@Providers.org
 *          escrow_id: X7ADKN7H1WCM3NPN97RA701FP7
 *          state: false
 *          offer_request_id: 01FP7X7ADKN7H1WCM3NPN97RA7
 *          offer_id: OFFER_HU0612SQQ202167HU7
 *          start_date: 2021-12-06 12:58
 *          end_date: 2021-12-06 13:02
 *          offer_data_hash_id: [ "26cq6-hbph0612p06p0i-6gn21decvc3-1bmjgc"]
 *          providerDeposit: 1000
 *          consumerDeposit: 1000
 *            
 */

 /**
 * @swagger
 * /api/v1/dataagreement/revokeAgreement:
 *  post:
 *      summary: Revoke an agreement
 *      tags: [Data Agreements]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                       agreement_id:
 *                          type: string
 *                          description: the agreement id to be revoked
 *                      example:
 *                       agreement_id: 76876877889
 *      responses:
 *        200:
 *          description: Agreement is revoked
 * 
 * 
 * /api/v1/dataagreement:
 *  get:
 *      summary: Retrive all data Agreements 
 *      tags: [Data Agreements]                
 *      responses:
 *        200:
 *          description: List of data Agreements
 *          content:
 *              application/json:
 *                  schema:
 *                     type: array
 *                     items:
 *                      $ref: '#/components/schemas/dataAgreements'
 * 
 */
const router = Router();


router.get("/", GetAllAgreements);
router.post("/revokeAgreement", RevokeAgreement);

export default router;