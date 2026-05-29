import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "crypto";
import { getUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import UserModel from "../models/User.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const token = randomBytes(24).toString("hex");

  await UserModel.findByIdAndUpdate(userId, { coplannerInviteToken: token });

  const inviteUrl = `${process.env.APP_URL ?? "http://localhost:5173"}/coplanner-invite/${token}`;
  return res.status(200).json({ inviteUrl, token });
}
