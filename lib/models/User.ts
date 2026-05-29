import mongoose, { Model, Schema, Types } from "mongoose";

export type UserRole = "primary" | "co-planner" | "planner-pro";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  partnerName?: string;
  weddingDate?: Date;
  role: UserRole;
  coplannerOf?: Types.ObjectId;
  coplannerInviteToken?: string;
  managedCouples?: Types.ObjectId[];
  familyToken?: string;
  partyUploadToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true, trim: true },
    partnerName: { type: String, trim: true },
    weddingDate: Date,
    role: { type: String, enum: ["primary", "co-planner", "planner-pro"], default: "primary" },
    coplannerOf: { type: Schema.Types.ObjectId, ref: "User" },
    coplannerInviteToken: String,
    managedCouples: [{ type: Schema.Types.ObjectId, ref: "User" }],
    familyToken: { type: String, sparse: true },
    partyUploadToken: String,
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });

const UserModel = (mongoose.models.User as Model<IUser> | undefined) ?? mongoose.model<IUser>("User", UserSchema);
export default UserModel;
