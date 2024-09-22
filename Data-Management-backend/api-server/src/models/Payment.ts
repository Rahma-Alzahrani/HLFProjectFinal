import mongoose from "mongoose";


export type PaymentDocument = mongoose.Document & {
    customerId: string;
    paymentId: string;
    paymentStatus: string;
    paymentAmount: number;
    paymentCurrency: string;
    paymentDate: Date;
    paymentMethod: string;
    paymentDescription: string;
    profileId: string;
    // paymentProvider: boolean;
    // paymentConsumer: boolean;
    paymentUserRole: string;
    order_id: string;
    offer_request_id: string;
    refund_amount: string;
};

const paymentSchema = new mongoose.Schema<PaymentDocument>(
    {
        customerId: { type: String, required: true },
        paymentId: { type: String, required: true },
        paymentStatus: { type: String, required: true },
        paymentAmount: { type: Number, required: true },
        paymentCurrency: { type: String, required: true },
        paymentDate: { type: Date, required: true },
        paymentMethod: { type: String, required: true },
        paymentDescription: { type: String, required: true },
        profileId: { type: String, required: true },
        // paymentProvider: { type: Boolean, required: true },
        // paymentConsumer: { type: Boolean, required: true },
        paymentUserRole: { type: String, required: true },
        order_id: { type: String, required: true },
        offer_request_id: { type: String, required: true },
        refund_amount: { type: String, default: "0" },
    },
    { timestamps: true },
);

export const Payment = mongoose.model<PaymentDocument>("Payment", paymentSchema);

