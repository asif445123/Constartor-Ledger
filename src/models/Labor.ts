import mongoose, { Schema, models, model } from "mongoose";

const AttendanceSchema = new Schema(
  { date: String, day: String },
  { _id: false }
);

const LaborExpenseSchema = new Schema(
  { date: String, day: String, amount: Number, note: String },
  { _id: false }
);

export interface ILabor {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  rate: number;
  mobile: string;
  site: string;
  att: number;
  kharcha: number;
  attendance: { date: string; day: string }[];
  expenses: { date: string; day: string; amount: number; note: string }[];
  createdAt: Date;
}

const LaborSchema = new Schema<ILabor>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  rate: { type: Number, default: 0 },
  mobile: { type: String, default: "" },
  site: { type: String, default: "" },
  att: { type: Number, default: 0 },
  kharcha: { type: Number, default: 0 },
  attendance: { type: [AttendanceSchema], default: [] },
  expenses: { type: [LaborExpenseSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Labor as mongoose.Model<ILabor>) || model<ILabor>("Labor", LaborSchema);
