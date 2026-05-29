import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getEffectiveUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import Guest from "../../lib/models/Guest.js";

const patchSchema = z.object({
  rsvpStatus: z.enum(["pending", "accepted", "declined"]).optional(),
  tableNumber: z.number().int().min(1).optional().nullable(),
  dietary: z.string().max(80).optional(),
  plusOne: z.boolean().optional(),
  plusOneName: z.string().max(80).optional(),
  songRequest: z.string().max(200).optional(),
  rsvpDeadline: z.string().datetime({ offset: true }).optional().nullable(),
  conflictWith: z.array(z.string()).optional(),
  seatTags: z.array(z.string().max(40)).max(10).optional(),
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
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.conflictWith !== undefined) {
      updateData.conflictWith = parsed.data.conflictWith
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
    }

    const item = await Guest.findOneAndUpdate(
      { _id: itemObjectId, userId: userObjectId },
      { $set: updateData },
      { new: true },
    );
    if (!item) {
      return res.status(404).json({ error: "Guest not found" });
    }
    return res.status(200).json({ item });
  }

  if (req.method === "DELETE") {
    await Guest.findOneAndDelete({ _id: itemObjectId, userId: userObjectId });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
