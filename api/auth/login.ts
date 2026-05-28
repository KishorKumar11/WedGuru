import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authCookie, signAuthToken } from "../../lib/auth";
import { connectDb } from "../../lib/db";
import User from "../../lib/models/User";

const schema = z.object({
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
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(parsed.data.password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signAuthToken(String(user._id));
  res.setHeader("Set-Cookie", authCookie(token));
  return res.status(200).json({
    user: { _id: String(user._id), name: user.name, email: user.email, partnerName: user.partnerName, weddingDate: user.weddingDate },
  });
}
