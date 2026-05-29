import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { Types } from "mongoose";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getEffectiveUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import Guest from "../models/Guest.js";
import { logActivity } from "../activity.js";

const createSchema = z.object({
  name: z.string().min(1).max(120).trim(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
  rsvpDeadline: z.string().datetime({ offset: true }).optional(),
  seatTags: z.array(z.string().max(40)).max(10).optional(),
  dietary: z.string().max(80).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await getEffectiveUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();

  if (req.method === "GET") {
    const items = await Guest.find({ userId: userObjectId }).sort({ createdAt: -1 });

    if (req.query.format === "csv") {
      const csv = stringify(
        items.map((guest) => [
          guest.name,
          guest.email ?? "",
          guest.phone ?? "",
          guest.rsvpStatus,
          guest.dietary ?? "",
          guest.tableNumber ?? "",
          guest.plusOne ? "Yes" : "No",
          guest.plusOneName ?? "",
          guest.seatTags?.join(";") ?? "",
        ]),
        {
          header: true,
          columns: ["Name", "Email", "Phone", "RSVP", "Dietary", "Table", "Plus One", "Plus One Name", "Tags"],
        },
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=wedguru-guests.csv");
      return res.status(200).send(csv);
    }

    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    }
    const item = await Guest.create({
      ...parsed.data,
      userId: userObjectId,
      inviteToken: crypto.randomUUID(),
    });
    await logActivity(userId, "added_guest", `Added guest: ${parsed.data.name}`);
    return res.status(201).json({ item });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
