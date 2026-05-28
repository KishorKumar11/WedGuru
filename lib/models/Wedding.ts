import mongoose, { Schema } from "mongoose";

const WeddingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    weddingDate: Date,
    venue: String,
    budgetTotal: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Wedding ?? mongoose.model("Wedding", WeddingSchema);
