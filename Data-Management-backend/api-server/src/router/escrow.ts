import { Router } from "express";
import { GetAllEscrow, GetAllEscrowAdmin } from "../controllers/escrow";

/**
 * @swagger
 * tags:
 *  name: Escrow
 *  description: Escrow endpoint
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      escrows:
 *       type: object
 *       required:
 *          -consumer
 *          -provider
 *          - id
 *          -providerDeposit
 *          -consumerDeposit
 *          -consumerPayment
 *          -released
 *          -offer_request_id
 *          -offer_id
 *          -status
 *          -startDate
 *          -endDate
 *          -agreement_id
 *       properties:
 *          consumer:
 *           type: string
 *           description: The data consumer
 *          provider:
 *           type: string
 *           description: The data provider
 *          id:
 *           type: string
 *           description: The id of the escrow record in docType 'Escrow'
 *          providerDeposit:
 *           type: number
 *           description: The provider deposit
 *          consumerDeposit:
 *           type: number
 *           description: The consumer deposit
 *          consumerPayment:
 *           type: number
 *           description: The consumer payment
 *          released:
 *           type: boolean
 *           description: escrow releasing (true or false)
 *          offer_request_id:
 *           type: string
 *           description: The offer request id in the docType 'offer_request_id'
 *          offer_id:
 *           type: string
 *           description: The offer id in the docType 'data_offer'
 *          status:
 *           type: string
 *           description: The status of escrow ( revoked , expired, active)
 *          startDate:
 *           type: string
 *           format: date-time
 *           description: The starting date
 *          endDate:
 *           type: string
 *           format: date-time
 *           description: The ending date
 *          agreement_id:
 *           type: string
 *           description: The agreement id in the docType 'data_agreement'
 * 
 *       example:
 *          consumer: First.Great.Western@Consumers.org
 *          provider: Siemens@Providers.org
 *          id: ZD70RDYW8SKCZM6Y4KKJ101FP7
 *          providerDeposit: 500
 *          consumerDeposit: 500
 *          consumerPayment: 500
 *          released: true
 *          offer_request_id: 01FP7ZD70RDYW8SKCZM6Y4KKJ1
 *          offer_id: OFFER_I50612V7I20215MS8S
 *          status: REVOKED
 *          startDate: 2021-12-06 13:37
 *          endDate: 2021-12-06 13:41
 *          agreement_id: DYW8SKCZM6Y4KKJ101FP7ZD70R
 * 
 */

 /**
  * @swagger
  * /api/v1/escrow:
  *   get:
  *      summary: Retrive all Escrows Records 
  *      tags: [Escrow]                
  *      responses:
  *        200:
  *          description: List of the Escrows
  *          content:
  *              application/json:
  *                  schema:
  *                     type: array
  *                     items:
  *                      $ref: '#/components/schemas/escrows'
  */
const router = Router();


router.get("/", GetAllEscrow);
router.get("/admin", GetAllEscrowAdmin);

export default router;