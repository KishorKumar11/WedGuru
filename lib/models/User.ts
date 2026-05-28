import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true, trim: true },
    partnerName: { type: String, trim: true },
    weddingDate: Date,
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
