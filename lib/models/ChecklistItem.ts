import mongoose, { Schema } from "mongoose";

const ChecklistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    monthsBefore: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ChecklistSchema.index({ userId: 1, order: 1 });

export default mongoose.models.ChecklistItem ?? mongoose.model("ChecklistItem", ChecklistSchema);
