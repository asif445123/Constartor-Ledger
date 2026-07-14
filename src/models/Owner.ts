import mongoose, { Schema, models, model } from "mongoose";

const HistorySchema = new Schema(
  {
    date: String,
    day: String,
    amount: Number,
    type: { type: String, enum: ["deal", "receipt"] },
    desc: String,
    from: String,
  },
  { _id: false }
);

export interface IOwner {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  site: string;
  mobile: string;
  contractTotal: number;
  originalContract: number;
  received: number;
  history: {
    date: string;
    day: string;
    amount: number;
    type: "deal" | "receipt";
    desc?: string;
    from?: string;
  }[];
  date: string;
  day: string;
  desc: string;
  createdAt: Date;
}

const OwnerSchema = new Schema<IOwner>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  site: { type: String, required: true },
  mobile: { type: String, default: "" },
  contractTotal: { type: Number, default: 0 },
  originalContract: { type: Number, default: 0 },
  received: { type: Number, default: 0 },
  history: { type: [HistorySchema], default: [] },
  date: { type: String, default: "" },
  day: { type: String, default: "" },
  desc: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Owner as mongoose.Model<IOwner>) || model<IOwner>("Owner", OwnerSchema);
