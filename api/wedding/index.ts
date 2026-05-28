import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import Wedding from "../../lib/models/Wedding.js";

const schema = z.object({
  weddingDate: z.string().datetime().optional(),
  venue: z.string().max(140).optional(),
  budgetTotal: z.number().nonnegative().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const userObjectId = new Types.ObjectId(userId);
  let wedding = await Wedding.findOne().where("userId").equals(userObjectId);
  if (!wedding) {
    wedding = await Wedding.create({ userId: userObjectId });
  }

  if (req.method === "GET") {
    return res.status(200).json({ wedding });
  }

  if (req.method === "PUT") {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid wedding payload" });
    }
    const nextValues: Record<string, unknown> = {};
    if (parsed.data.weddingDate !== undefined) {
      nextValues.weddingDate = new Date(parsed.data.weddingDate);
    }
    if (parsed.data.venue !== undefined) {
      nextValues.venue = parsed.data.venue;
    }
    if (parsed.data.budgetTotal !== undefined) {
      nextValues.budgetTotal = parsed.data.budgetTotal;
    }
    const updatedWedding = await Wedding.findByIdAndUpdate(wedding._id, nextValues, { new: true });
    return res.status(200).json({ wedding: updatedWedding });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
