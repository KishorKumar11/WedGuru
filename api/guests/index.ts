import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { getUserId } from "../_utils.js";
import { connectDb } from "../../lib/db.js";
import Guest from "../../lib/models/Guest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  await connectDb();
  if (req.method === "GET") {
    const items = await Guest.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  }
  if (req.method === "POST") {
    const item = await Guest.create({ ...req.body, userId, inviteToken: crypto.randomUUID() });
    return res.status(201).json({ item });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
