import mongoose, { Model, Schema, Types } from "mongoose";

export interface IBudgetItem {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  category: string;
  vendor: string;
  estimated: number;
  actual: number;
  paid: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BudgetSchema = new Schema<IBudgetItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    vendor: { type: String, required: true, trim: true },
    estimated: { type: Number, default: 0 },
    actual: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    notes: String,
  },
  { timestamps: true },
);

BudgetSchema.index({ userId: 1, category: 1 });

const BudgetItemModel =
  (mongoose.models.BudgetItem as Model<IBudgetItem> | undefined) ??
  mongoose.model<IBudgetItem>("BudgetItem", BudgetSchema);
export default BudgetItemModel;
