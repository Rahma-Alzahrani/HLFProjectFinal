import mongoose, { Document, Model, Schema } from "mongoose";

interface ClaimPeriod {
  claimPeriodHours: number;
  claimPeriodMinutes: number;
  claimPeriodStatus: boolean;
  claimPeriodCreated: boolean;
}

interface ClaimPeriodDocument extends Document, ClaimPeriod {}

type ClaimPeriodModel = Model<ClaimPeriodDocument>

const claimPeriodSchema = new Schema<ClaimPeriodDocument, ClaimPeriodModel>({
  claimPeriodHours: { type: Number, required: true,default: 0 },
  claimPeriodMinutes: { type: Number, required: true,default: 0 },
  claimPeriodStatus: { type: Boolean, required: true },
  claimPeriodCreated: { type: Boolean, required: true },
});

const ClaimPeriod = mongoose.model<ClaimPeriodDocument, ClaimPeriodModel>("ClaimPeriod", claimPeriodSchema);

//init claim period
const initClaimPeriod = async () => {
  const claimPeriodExists = await ClaimPeriod.findOne({
    claimPeriodCreated: true,
  });
  if (!claimPeriodExists) {
    const claimPeriod = new ClaimPeriod({
      claimPeriodHours: 1,
      claimPeriodMinutes: 0,
      claimPeriodStatus: true,
      claimPeriodCreated: true,
    });
    await claimPeriod.save();
  }
};

initClaimPeriod();


export { ClaimPeriod, ClaimPeriodDocument, ClaimPeriodModel };
