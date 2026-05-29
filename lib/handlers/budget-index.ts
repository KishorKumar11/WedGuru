import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getEffectiveUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import BudgetItem from "../models/BudgetItem.js";
import { logActivity } from "../activity.js";

const createSchema = z.object({
  category: z.string().min(1).max(60),
  vendor: z.string().min(1).max(120).trim(),
  estimated: z.number().nonnegative().default(0),
  actual: z.number().nonnegative().default(0),
  paid: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await getEffectiveUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();

  if (req.method === "GET") {
    const items = await BudgetItem.find({ userId: userObjectId }).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }
    const item = await BudgetItem.create({ ...parsed.data, userId: userObjectId });
    await logActivity(userId, "added_budget", `Added expense: ${parsed.data.vendor} (${parsed.data.category}) $${parsed.data.actual}`);
    return res.status(201).json({ item });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
