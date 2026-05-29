import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getEffectiveUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import ChecklistItem from "../models/ChecklistItem.js";

const patchSchema = z.object({
  isCompleted: z.boolean().optional(),
  title: z.string().min(2).max(140).optional(),
  assignee: z.string().max(80).optional().nullable(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await getEffectiveUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const itemObjectId = new Types.ObjectId(String(req.query.id));
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();

  if (req.method === "PUT") {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const item = await ChecklistItem.findOneAndUpdate(
      { _id: itemObjectId, userId: userObjectId },
      { $set: parsed.data },
      { new: true },
    );
    return res.status(200).json({ item });
  }

  if (req.method === "DELETE") {
    await ChecklistItem.findOneAndDelete({ _id: itemObjectId, userId: userObjectId });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
