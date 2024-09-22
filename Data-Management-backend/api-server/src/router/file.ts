import { Router } from "express";
import multer from "multer";
import { getFileByName, saveFile } from "../controllers/dataFile";

/**
 * @swagger
 * components:
 *  schemas:
 *      saveFile:
 *       type: object
 *       required:
 *          -fieldname
 *          -originalname
 *          -encoding
 *          -mimetype
 *          -id
 *          -filename
 *          -metadata
 *          -bucketName
 *          -chunkSize
 *          -size
 *          -md5
 *          -uploadDate
 *          -contentType
 *       properties:
 *          fieldname:
 *              type: string
 *          originalname:
 *              type: string
 *          encoding:
 *              type: string
 *          mimetype:
 *              type: string
 *          id:
 *              type: string
 *          filename:
 *              type: string
 *          metadata:
 *              type: string
 *              nullable: true
 *          bucketName:
 *              type: string
 *          chunkSize:
 *              type: number
 *          size:
 *              type: number
 *          md5:
 *              type: string
 *          uploadDate:
 *              type: string
 *          contentType:
 *              type: string
 *       example:
 *        fieldname: file
 *        originalname: RailBAM-First.png
 *        encoding: 7bit
 *        mimetype: image/png
 *        id: 61d6e179d804ef2123738e1c
 *        filename: 375e016d7b425055c109f61cf6b1b8cb.png
 *        metadata: null
 *        bucketName: uploads
 *        chunkSize: 261120
 *        size: 384989
 *        md5: 4f230fbea8cade36102930cfbeef87d0
 *        uploadDate: 2022-01-06T12:32:57.922Z
 *        contentType: image/png
 * 
 *      docFile:
 *        type: object
 *        required:
 *          -file
 *        properties:
 *          file:
 *              type: string
 *              format: binary
 * 
 */
/**
 * @swagger
 * /api/v1/files:
 *  post:
 *      summary: Upload a new file to generate the hash value
 *      tags: [Data-Hashes]
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                    $ref: '#/components/schemas/docFile'
 *      responses:
 *        200:
 *          description: Hash value generated
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/saveFile'
 */
const router = Router();

export default function (upload: multer.Multer): Router {
  //
  router.post("/", upload.single("file"), saveFile);
  router.post("/download", getFileByName);
  return router;
}
