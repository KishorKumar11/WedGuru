import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import ChecklistItem from "../../lib/models/ChecklistItem.js";

const schema = z.object({
  title: z.string().min(2).max(140),
  category: z.string().min(2),
  monthsBefore: z.string().min(1),
  order: z.number().int().nonnegative().default(0),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();
  if (req.method === "GET") {
    const items = await ChecklistItem.find().where("userId").equals(userObjectId).sort({ order: 1 });
    return res.status(200).json({ items });
  }
  if (req.method === "POST") {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const item = await ChecklistItem.create({ ...parsed.data, userId: userObjectId });
    return res.status(201).json({ item });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
