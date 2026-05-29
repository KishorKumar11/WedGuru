import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { authCookie, signAuthToken } from "../auth.js";
import { connectDb } from "../db.js";
import UserModel from "../models/User.js";
import bcrypt from "bcryptjs";

const schema = z.object({
  token: z.string().min(1),
  name: z.string().min(1).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  await connectDb();
  const { token, name, email, password } = parsed.data;

  const primaryUser = await UserModel.findOne({ coplannerInviteToken: token });
  if (!primaryUser) {
    return res.status(404).json({ error: "Invite token not found or already used" });
  }

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 12);
  const coplanner = await UserModel.create({
    email,
    password: hashed,
    name,
    role: "co-planner",
    coplannerOf: primaryUser._id,
    weddingDate: primaryUser.weddingDate,
    partnerName: primaryUser.name,
  });

  if (!coplanner) {
    return res.status(500).json({ error: "Failed to create co-planner account" });
  }

  await UserModel.findByIdAndUpdate(primaryUser._id, { $unset: { coplannerInviteToken: 1 } });

  const authToken = signAuthToken(String(coplanner._id));
  res.setHeader("Set-Cookie", authCookie(authToken));
  return res.status(201).json({
    user: {
      _id: String(coplanner._id),
      name: coplanner.name,
      email: coplanner.email,
      role: coplanner.role,
      coplannerOf: String(primaryUser._id),
    },
  });
}
