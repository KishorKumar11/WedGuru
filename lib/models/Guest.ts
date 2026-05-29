import mongoose, { Model, Schema, Types } from "mongoose";

export interface IGuest {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
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
  rsvpDeadline?: Date;
  conflictWith?: Types.ObjectId[];
  seatTags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
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
    rsvpDeadline: Date,
    conflictWith: [{ type: Schema.Types.ObjectId, ref: "Guest" }],
    seatTags: [String],
  },
  { timestamps: true },
);

GuestSchema.index({ userId: 1, rsvpStatus: 1 });

const GuestModel = (mongoose.models.Guest as Model<IGuest> | undefined) ?? mongoose.model<IGuest>("Guest", GuestSchema);
export default GuestModel;
