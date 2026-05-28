import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { Types } from "mongoose";
import { stringify } from "csv-stringify/sync";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import Guest from "../../lib/models/Guest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userObjectId = new Types.ObjectId(userId);
  await connectDb();
  if (req.method === "GET") {
    const items = await Guest.find().where("userId").equals(userObjectId).sort({ createdAt: -1 });
    if (req.query.format === "csv") {
      const csv = stringify(
        items.map((guest) => [guest.name, guest.email ?? "", guest.rsvpStatus, guest.tableNumber ?? ""]),
        { header: true, columns: ["Name", "Email", "RSVP", "Table"] },
      );
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=wedguru-guests.csv");
      return res.status(200).send(csv);
    }
    return res.status(200).json({ items });
  }
  if (req.method === "POST") {
    const item = await Guest.create({ ...req.body, userId: userObjectId, inviteToken: crypto.randomUUID() });
    return res.status(201).json({ item });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
