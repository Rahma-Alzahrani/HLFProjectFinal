import { Router } from "express";
import { createBankDetails, getBankDetails, getBankDetailsById, updateBankDetailsById } from  "../controllers/bankDetails";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BankDetails:
 *       type: object
 *       properties:
 *         bankName:
 *           type: string
 *           description: The name of the bank.
 *         bankAccountNumber:
 *           type: string
 *           description: The bank account number.
 *         bankAccountHolderName:
 *           type: string
 *           description: The name of the bank account holder.
 *         bankAccountIFSC:
 *           type: string
 *           description: The IFSC code of the bank.
 *         email:
 *           type: string
 *           description: The email associated with the bank account.
 *         type:
 *           type: string
 *           description: The type of account (Provider or Consumer).
 *         orgname:
 *           type: string
 *           description: The organization name.
 *       required:
 *         - bankName
 *         - bankAccountNumber
 *         - bankAccountHolderName
 *         - bankAccountIFSC
 *         - email
 *         - type
 *         - orgname
 *       example:
 *         bankName: "HDFC"
 *         bankAccountNumber: "123456789"
 *         bankAccountHolderName: "Ra1"
 *         bankAccountIFSC: "HDFC0000123"
 *         email: "ra1@yopmail.com"
 *         type: "Provider"
 *         orgname: "Org1"
 */

/**
 * @swagger
 * /api/bankDetails:
 *   post:
 *     summary: Create bank details.
 *     tags: [BankDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankDetails'
 *     responses:
 *       200:
 *         description: Bank details created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankDetails'
 *       400:
 *         description: Bad request, invalid input data.
 *
 *   get:
 *     summary: Get a list of bank details.
 *     tags: [BankDetails]
 *     responses:
 *       200:
 *         description: Successfully retrieved bank details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankDetails'
 *
 * /api/bankDetails/{id}:
 *   get:
 *     summary: Get a bank details entry by ID.
 *     tags: [BankDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank details entry.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved a bank details entry by ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankDetails'
 *       404:
 *         description: Bank details entry not found.
 *
 *   put:
 *     summary: Update a bank details entry by ID.
 *     tags: [BankDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bank details entry to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankDetails'
 *     responses:
 *       200:
 *         description: Successfully updated a bank details entry by ID.
 *       404:
 *         description: Bank details entry not found.
 */


router.post("/", createBankDetails);
router.get("/", getBankDetails);
router.get("/:id", getBankDetailsById);
router.put("/:id", updateBankDetailsById);

export default router;