import mongoose, { Document, Model, Schema } from "mongoose";

interface TransactionDetails {
    costId: string;
    providerTransactionId: string;

    consumerTransactionId: string;

    transactionStatus: boolean;
}

interface TransactionDetailsDocument extends Document, TransactionDetails {}

type TransactionDetailsDocumentModel = Model<TransactionDetailsDocument>

const transactionDetailsSchema = new Schema<
  TransactionDetailsDocument,
  TransactionDetailsDocumentModel
>({
    costId: { type: String, required: true },
    providerTransactionId: { type: String, required: true },
    consumerTransactionId: { type: String, required: true },
    transactionStatus: { type: Boolean, required: true },
  
});

const TransactionDetails = mongoose.model<
  TransactionDetailsDocument,
  TransactionDetailsDocumentModel
>("TransactionDetails", transactionDetailsSchema);

export {
  TransactionDetails,
  TransactionDetailsDocument,
  TransactionDetailsDocumentModel,
};
