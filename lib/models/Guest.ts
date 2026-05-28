import mongoose, { Model, Schema } from "mongoose";

export interface IGuest {
  userId: Schema.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: "pending" | "accepted" | "declined";
  dietary?: string;
  plusOne: boolean;
  plusOneName?: string;
  songRequest?: string;
  tableNumber?: number;
  inviteToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
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

const GuestModel = (mongoose.models.Guest as Model<IGuest> | undefined) ?? mongoose.model<IGuest>("Guest", GuestSchema);
export default GuestModel;
