import mongoose, { Model, Schema, Types } from "mongoose";

export interface IChecklistItem {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  category: string;
  monthsBefore: string;
  isCompleted: boolean;
  order: number;
  assignee?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChecklistSchema = new Schema<IChecklistItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    monthsBefore: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    assignee: { type: String, trim: true },
    dueDate: Date,
  },
  { timestamps: true },
);

ChecklistSchema.index({ userId: 1, order: 1 });

const ChecklistItemModel =
  (mongoose.models.ChecklistItem as Model<IChecklistItem> | undefined) ??
  mongoose.model<IChecklistItem>("ChecklistItem", ChecklistSchema);
export default ChecklistItemModel;
