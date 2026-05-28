import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { getUserId } from "../_utils.js";
import { connectDb } from "../../lib/db.js";
import BudgetItem from "../../lib/models/BudgetItem.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const itemObjectId = new Types.ObjectId(String(req.query.id));
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();
  if (req.method === "PUT") {
    const item = await BudgetItem.findOneAndUpdate()
      .where("_id")
      .equals(itemObjectId)
      .where("userId")
      .equals(userObjectId)
      .set(req.body)
      .setOptions({ new: true });
    return res.status(200).json({ item });
  }
  if (req.method === "DELETE") {
    await BudgetItem.findOneAndDelete().where("_id").equals(itemObjectId).where("userId").equals(userObjectId);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
