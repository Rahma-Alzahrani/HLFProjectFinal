import express from "express";
import { authenticate } from "passport";
import * as auth from "../controllers/auth";
const router = express.Router();
/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Authentication endpoint
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User-Signup:
 *       type: object
 *       required:
 *          -email
 *          -password
 *          -type
 *          -orgname
 *       properties:
 *          email:
 *              type: string
 *              description: the user email is the format used to identify the username and will be used to send email messages 
 *          password: 
 *              type: string
 *              description: the user password that will be used to loging to the network
 *          confirmPassword:
 *              type: string
 *              description: the user password confirmation
 *          type:
 *              type: string
 *              description: the user type (Provider or Consumer)
 *          orgname:
 *              type: string
 *              description: the organization that the user belongs to ( Org1 or Org2)
 *       example:
 *          email: Siemens@Providers.org
 *          password: Siemens
 *          confirmPassword: Siemens
 *          type: Provider
 *          orgname: Org1
 *    User:
 *       type: object
 *       required:
 *          -email
 *          -password
 *          -type
 *          -orgname
 *       properties:
 *          email:
 *              type: string
 *              description: the user email is the format used to identify the username and will be used to send email messages 
 *          password: 
 *              type: string
 *              description: the user password that will be used to loging to the network
 *          type:
 *              type: string
 *              description: the user type (Provider or Consumer)
 *          orgname:
 *              type: string
 *              description: the organization that the user belongs to ( Org1 or Org2)
 *       example:
 *          email: Siemens@Providers.org
 *          password: Siemens
 *          type: Provider
 *          orgname: Org1
 */

 /** 
  * @swagger
  * /api/v1/auth/login:
  *  post:
  *   summary: Login to the system
  *   tags: [Authentication]
  *   requestBody:
  *     required: true
  *     content:
  *        application/json:
  *             schema:
  *                $ref: '#/components/schemas/User'
  *   responses:
  *      200:
  *        description: Login Successfull
  *        content:
  *          application/json:
  *              schema:
  *               type: object
  *               items:
  *                token:
  *                 type: string
  *                type: 
  *                 type: string
  *                email:
  *                 type: string
  *                orgname:
  *                 type: string
  *                createdAt:
  *                 type: string
  *                 format: date-time
  *                updatedAt:
  *                 type: string
  *                 format: date-time
  *               example:
  *                 type: provider
  *                 email: Siemens@Providers.org
  *                 orgname: Org1
  *                 createdAt: 2021-12-06T10:52:59.939Z
  *                 updatedAt: 2021-12-06T10:52:59.939Z
  *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiUHJvdmlkZXIiLCJfaWQiOiI2MWFkZWI4YjUzMjBkNDQ0YzlkMzA3MTAiLCJlbWFpbCI6IlNpZW1lbnNAUHJvdmlkZXJzLm9yZyIsIm9yZ25hbWUiOiJPcmcxIiwiY3JlYXRlZEF0IjoiMjAyMS0xMi0wNlQxMDo1Mjo1OS45MzlaIiwidXBkYXRlZEF0IjoiMjAyMS0xMi0wNlQxMDo1Mjo1OS45MzlaIiwiX192IjowLCJpYXQiOjE2NDMwMjcxNDgsImV4cCI6MTY0MzExMzU0OH0.1YyC0IGqtYEtOYWUH2UExCqbCvUWfJ5Mc-e9yacDgsw
  *      500:
  *         description: Error  
  *  */


/**
 * @swagger
 * /api/v1/auth/signup:
 *  post:
 *    summary: Signup process
 *    tags: [Authentication]
 *    requestBody:
 *     required: true
 *     content:
 *        application/json:
 *         schema:
 *            $ref: '#/components/schemas/User-Signup'
 *    responses:
 *      200:
 *        description: Signup Successfull
 *        content:
 *          application/json:
 *              schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/User-Signup'
 *      500:
 *         description: Error  
 */
router.post("/signup", auth.signup);
router.post("/login",  auth.login);
router.post("/logout", auth.logout);

export default router;