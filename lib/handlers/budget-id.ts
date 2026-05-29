import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { getUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import BudgetItem from "../models/BudgetItem.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const itemObjectId = new Types.ObjectId(String(req.query.id));
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();
  if (req.method === "PUT") {
    const item = await BudgetItem.findOneAndUpdate(
      { _id: itemObjectId, userId: userObjectId },
      { $set: req.body },
      { new: true },
    );
    return res.status(200).json({ item });
  }
  if (req.method === "DELETE") {
    await BudgetItem.findOneAndDelete({ _id: itemObjectId, userId: userObjectId });
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
