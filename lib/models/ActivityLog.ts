import mongoose, { Model, Schema } from "mongoose";

export interface IActivityLog {
  userId: Schema.Types.ObjectId;
  action: string;
  detail: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { timestamps: true },
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLogModel =
  (mongoose.models.ActivityLog as Model<IActivityLog> | undefined) ??
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
export default ActivityLogModel;
