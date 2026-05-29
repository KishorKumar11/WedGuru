import mongoose, { Model, Schema } from "mongoose";

export interface IPartyTask {
  userId: Schema.Types.ObjectId;
  assignedTo: string;
  title: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PartyTaskSchema = new Schema<IPartyTask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    dueDate: Date,
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

PartyTaskSchema.index({ userId: 1, isCompleted: 1 });

const PartyTaskModel =
  (mongoose.models.PartyTask as Model<IPartyTask> | undefined) ??
  mongoose.model<IPartyTask>("PartyTask", PartyTaskSchema);
export default PartyTaskModel;
