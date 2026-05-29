import mongoose, { Model, Schema, Types } from "mongoose";

export interface IWedding {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  weddingDate?: Date;
  venue?: string;
  budgetTotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const WeddingSchema = new Schema<IWedding>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    weddingDate: Date,
    venue: String,
    budgetTotal: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const WeddingModel =
  (mongoose.models.Wedding as Model<IWedding> | undefined) ?? mongoose.model<IWedding>("Wedding", WeddingSchema);
export default WeddingModel;
