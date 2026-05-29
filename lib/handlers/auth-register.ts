import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authCookie, signAuthToken } from "../auth.js";
import { connectDb } from "../db.js";
import User from "../models/User.js";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  await connectDb();
  const email = parsed.data.email.toLowerCase();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already used" });
  }

  const password = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({ ...parsed.data, email, password });
  const token = signAuthToken(String(user._id));
  res.setHeader("Set-Cookie", authCookie(token));
  return res.status(201).json({
    user: { _id: String(user._id), name: user.name, email: user.email, partnerName: user.partnerName, weddingDate: user.weddingDate },
  });
}
