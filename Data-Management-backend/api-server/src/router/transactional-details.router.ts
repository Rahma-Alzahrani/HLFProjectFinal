import express from "express";
import { createTransactionDetails,updateTransactionDetailsById, getTransactionDetails,getTransactionDetailsById } from "../controllers/transactional-details";

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionDetails:
 *       type: object
 *       properties:
 *         costId:
 *           type: string
 *           description: The cost ID.
 *         providerTransactionId:
 *           type: string
 *           description: The provider transaction ID.
 *         consumerTransactionId:
 *           type: string
 *           description: The consumer transaction ID.
 *         transactionStatus:
 *           type: boolean
 *           description: The transaction status.
 *       required:
 *         - costId
 *         - providerTransactionId
 *         - consumerTransactionId
 *         - transactionStatus
 *       example:
 *         costId: "C123"
 *         providerTransactionId: "P123"
 *         consumerTransactionId: "C456"
 *         transactionStatus: true
 */

/**
 * @swagger
 * /api/transactionDetails:
 *   post:
 *     summary: Create transaction details.
 *     tags: [TransactionDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionDetails'
 *     responses:
 *       200:
 *         description: Transaction details created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionDetails'
 *       400:
 *         description: Bad request, invalid input data.
 *
 *   get:
 *     summary: Get a list of transaction details.
 *     tags: [TransactionDetails]
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionDetails'
 *
 * /api/transactionDetails/{id}:
 *   get:
 *     summary: Get a transaction details entry by ID.
 *     tags: [TransactionDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction details entry.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved a transaction details entry by ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionDetails'
 *       404:
 *         description: Transaction details entry not found.
 *
 *   put:
 *     summary: Update a transaction details entry by ID.
 *     tags: [TransactionDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction details entry to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionDetails'
 *     responses:
 *       200:
 *         description: Successfully updated a transaction details entry by ID.
 *       404:
 *         description: Transaction details entry not found.
 */


router.post("/", createTransactionDetails);
router.get("/", getTransactionDetails);
router.get("/:id", getTransactionDetailsById);
router.put("/:id", updateTransactionDetailsById);

export default router;