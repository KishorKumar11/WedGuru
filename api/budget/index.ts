import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import BudgetItem from "../../lib/models/BudgetItem.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();
  if (req.method === "GET") {
    const items = await BudgetItem.find().where("userId").equals(userObjectId).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  }
  if (req.method === "POST") {
    const item = await BudgetItem.create({ ...req.body, userId: userObjectId });
    return res.status(201).json({ item });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
