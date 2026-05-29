import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import PartyTaskModel from "../../lib/models/PartyTask.js";

const schema = z.object({
  assignedTo: z.string().min(1).max(80).trim(),
  title: z.string().min(2).max(200).trim(),
  dueDate: z.string().datetime({ offset: true }).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const userObjectId = new Types.ObjectId(userId);

  if (req.method === "GET") {
    const items = await PartyTaskModel.find().where("userId").equals(userObjectId).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }
    const item = await PartyTaskModel.create({ ...parsed.data, userId: userObjectId });
    return res.status(201).json({ item });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
