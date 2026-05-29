import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import PartyTaskModel from "../models/PartyTask.js";

const patchSchema = z.object({
  isCompleted: z.boolean().optional(),
  title: z.string().min(2).max(200).trim().optional(),
  assignedTo: z.string().min(1).max(80).trim().optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const taskId = String(req.query.id);
  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  await connectDb();
  const userObjectId = new Types.ObjectId(userId);

  if (req.method === "PUT") {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }
    const item = await PartyTaskModel.findOneAndUpdate(
      { _id: taskId, userId: userObjectId },
      { $set: parsed.data },
      { new: true },
    ).lean();
    if (!item) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ item });
  }

  if (req.method === "DELETE") {
    await PartyTaskModel.deleteOne({ _id: taskId, userId: userObjectId });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
