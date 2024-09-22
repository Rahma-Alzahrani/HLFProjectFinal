import { Router } from "express";
import { GetCost, GetTotalCost } from "../controllers/cost";


/**
 * @swagger
 * tags:
 *  name: Total Costs
 *  description: Data Costs endpoint
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      costs:
 *       type: object
 *       required:
 *          -falsifyCount
 *          -latencyCount
 *          - id
 *          -agreement
 *          -providerReimbursement
 *          -consumerRefund
 *          -escrow_id
 *          -dataProvider
 *          -dataConsumer
 *          -offer_request_id
 *       properties:
 *          falsifyCount:
 *           type: number
 *           description: The number of mismatched data records with hashes on the blockchain
 *          latencyCount:
 *           type: number
 *           description: The frequent latency in attaching data to the blockchain
 *          id:
 *           type: string
 *           description: The cost record id in docType 'Cost'
 *          agreement:
 *           type: string
 *           description: The agreement id in docType 'Data_Agreement'
 *          providerReimbursement:
 *           type: number
 *           description: The provider Reimbursement
 *          consumerRefund:
 *           type: number
 *           description: The consumer Refund
 *          escrow_id:
 *           type: string
 *           description: The Escrow id in docType 'Escrow'
 *          dataProvider:
 *           type: string
 *           description: The data provider
 *          dataConsumer:
 *           type: string
 *           description: The data Consumer
 *          offer_request_id:
 *           type: string
 *           description: The offer request id in the docType 'offer_request_id'
 *       example:
 *          falsifyCount: 0
 *          latencyCount: 0
 *          id: 01FP7TYSFMQTAXQC38JRRQ1EY2
 *          agreement: NYA9TS81EB53AM4H01FP7T8QS8
 *          providerReimbursement: 2923.08
 *          consumerRefund: 76.92
 *          escrow_id: T8QS8NYA9TS81EB53AM4H01FP7
 *          dataConsumer: Serco@Consumers.org
 *          dataProvider: Siemens@Providers.org
 *          offer_request_id: 01FP7T8QS8NYA9TS81EB53AM4H        
 */

 /**
  * @swagger
  * /api/v1/cost/totalCost:
  *   get:
  *      summary: Retrive all Costs Records 
  *      tags: [Total Costs]                
  *      responses:
  *        200:
  *          description: List of the costs
  *          content:
  *              application/json:
  *                  schema:
  *                     type: array
  *                     items:
  *                      $ref: '#/components/schemas/costs'
  */
const router = Router();

// this API is deprecated in this version 
router.get("/", GetCost);

router.get("/totalCost", GetTotalCost);

export default router;