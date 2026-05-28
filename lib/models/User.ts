import mongoose, { Model, Schema } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  partnerName?: string;
  weddingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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

const UserModel = (mongoose.models.User as Model<IUser> | undefined) ?? mongoose.model<IUser>("User", UserSchema);
export default UserModel;
