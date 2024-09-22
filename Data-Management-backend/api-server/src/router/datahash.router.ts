import { Router } from "express";
import { GetDataHashByAgreement, GetDataHashByOffer, saveDataHash } from "../controllers/datahash";
/**
 * @swagger
 * tags:
 *  name: Data-Hashes
 *  description: Add and retrieve data hashes endpoint
 */
/**
 * @swagger
 * components:
 *  schemas:
 *      dataHashs:
 *       type: object
 *       required:
 *          -offer_id
 *          -hash_id
 *          -datahash
 *          -filename
 *          -entrydate
 *       properties:
 *          offer_id:
 *              type: string
 *              description: The id of the offer.
 *          hash_id:
 *              type: string
 *              description: the id of the generated hashed data
 *          datahash:
 *              type: string
 *              description: the hash value using SHA1 
 *          filename:
 *              type: string
 *              description: this is to connect with the mongoDB
 *          entrydate:
 *              type: string
 *              format: date-time
 *              description: the time at which this value is attached to the BC
 *              
 *       example:
 *        offer_id: OFFER_HU0612SQQ202167HU7
 *        hash_id: ul3pe-4fst061242n241-1234-hhiv4c
 *        datahash: ca6ae2965363b0950933d9783cd39264c46de666
 *        filename: file-id-123
 *        entrydate: 2022-01-06 12:30
 */

/**
 * @swagger
 * /api/v1/datahash:
 *  post:
 *      summary: Send a new hash value
 *      tags: [Data-Hashes]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/dataHashs'
 *      responses:
 *        200:
 *          description: Hash value saved
 * 
 * 
 * /api/v1/datahash/GetDataHashByOffer:
 *  post:
 *      summary: Retrive all data hashes of specific offer
 *      tags: [Data-Hashes]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                      offer_id:
 *                         type: string
 *                      username:
 *                          type: string
 *                    example:
 *                      offer_id: OFFER_HU0612SQQ202167HU7
 *                      username: Siemens@Providers.org                 
 *      responses:
 *        200:
 *          description: List of data hashes
 *          content:
 *              application/json:
 *                  schema:
 *                     type: array
 *                     items:  
 *                     $ref: '#/components/schemas/dataHashs'
 * 
 * /api/v1/datahash/GetDataHashByAgreementID:
 *  post:
 *      summary: Retrive all data hashes of specific Agreement
 *      tags: [Data-Hashes]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                    type: object
 *                    items:
 *                      agreement_id:
 *                         type: string
 *                    example:
 *                      agreement_id: NYA9TS81EB53AM4H01FP7T8QS8                 
 *      responses:
 *        200:
 *          description: List of data hashes
 *          content:
 *              application/json:
 *                  schema:
 *                     type: array
 *                     items:  
 *                     $ref: '#/components/schemas/dataHashs' 
 */

const router = Router();


router.post("/", saveDataHash);

router.post("/GetDataHashByOffer", GetDataHashByOffer);
router.post("/GetDataHashByAgreementID", GetDataHashByAgreement);

export default router;