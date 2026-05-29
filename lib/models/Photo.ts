import mongoose, { Schema } from "mongoose";

const PhotoSchema = new Schema(
  {
    weddingId: { type: Schema.Types.ObjectId, ref: "Wedding", required: true },
    url: { type: String, required: true },
    caption: String,
    uploadedBy: String,
    approved: { type: Boolean, default: true },
    uploadToken: String,
  },
  { timestamps: true },
);

PhotoSchema.index({ weddingId: 1, createdAt: -1 });

export default mongoose.models.Photo ?? mongoose.model("Photo", PhotoSchema);
