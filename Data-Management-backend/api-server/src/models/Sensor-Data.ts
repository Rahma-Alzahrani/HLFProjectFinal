import mongoose from "mongoose";

export type SensorDataDocument = mongoose.Document & {
    device_id: string;
    data: Array<any>;
    isCompleted: boolean;
    timestamp: Date;
    start_time: Date;

};

const sensorDataSchema = new mongoose.Schema<SensorDataDocument>(
    {
        device_id: { type: String, required: true },
        data: { type: Array, required: true },
        isCompleted: { type: Boolean, required: true },
        timestamp: { type: Date, required: true },
        start_time: { type: Date, default: Date.now }
    }
);

export const SensorData = mongoose.model<SensorDataDocument>("SensorData", sensorDataSchema);