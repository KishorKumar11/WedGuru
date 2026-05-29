import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import ActivityLogModel from "../../lib/models/ActivityLog.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const logs = await ActivityLogModel.find()
    .where("userId")
    .equals(new Types.ObjectId(userId))
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return res.status(200).json({ logs });
}
