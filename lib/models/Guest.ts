import mongoose, { Schema } from "mongoose";

const GuestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: String,
    phone: String,
    rsvpStatus: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    dietary: String,
    plusOne: { type: Boolean, default: false },
    plusOneName: String,
    songRequest: String,
    tableNumber: Number,
    inviteToken: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

GuestSchema.index({ userId: 1, rsvpStatus: 1 });

export default mongoose.models.Guest ?? mongoose.model("Guest", GuestSchema);
