import mongoose, { Schema } from "mongoose";

const BudgetSchema = new Schema(
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

export default mongoose.models.BudgetItem ?? mongoose.model("BudgetItem", BudgetSchema);
