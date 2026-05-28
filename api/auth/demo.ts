import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { authCookie, signAuthToken } from "../../lib/auth.js";
import { connectDb } from "../../lib/db.js";
import User from "../../lib/models/User.js";

const demoUser = {
  name: "Demo Couple",
  email: "demo@wedguru.app",
  password: "WedGuru@123",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();
  let user = await User.findOne({ email: demoUser.email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(demoUser.password, 12);
    user = await User.create({
      name: demoUser.name,
      email: demoUser.email,
      password: hashedPassword,
      partnerName: "Alex",
    });
  }

  const token = signAuthToken(String(user._id));
  res.setHeader("Set-Cookie", authCookie(token));
  return res.status(200).json({
    user: {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      partnerName: user.partnerName,
      weddingDate: user.weddingDate,
    },
  });
}
