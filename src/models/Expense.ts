import mongoose, { Schema, models, model } from "mongoose";

export interface IExpense {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  date: string;
  day: string;
  site: string;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  date: { type: String, default: "" },
  day: { type: String, default: "" },
  site: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default (models.Expense as mongoose.Model<IExpense>) || model<IExpense>("Expense", ExpenseSchema);
