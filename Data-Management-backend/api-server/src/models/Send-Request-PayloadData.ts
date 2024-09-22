import mongoose from "mongoose";

export type SendRequestPayloadDocument = mongoose.Document & {
    offer_id: string;
    offer_request_id: string;
    price: number;
    cDeposit: number;
    dataConsumer: string;
    startDate: Date;
    endDate: Date;
    monitered_asset: string;
    multiple_offer_id: Array<string>;
};

const sendRequestPayloadSchema = new mongoose.Schema<SendRequestPayloadDocument>(
    {
        offer_id: { type: String, required: true },
        offer_request_id: { type: String, required: true },
        price: { type: Number },
        cDeposit: { type: Number },
        dataConsumer: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        monitered_asset: { type: String },
        multiple_offer_id: { type: Array },
    }
);

export const SendRequestPayload = mongoose.model<SendRequestPayloadDocument>("SendRequestPayload", sendRequestPayloadSchema);
