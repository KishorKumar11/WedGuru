import type { VercelRequest, VercelResponse } from "@vercel/node";
import { stringify } from "csv-stringify/sync";
import { getUserId } from "../_utils.js";
import { connectDb } from "../../lib/db.js";
import Guest from "../../lib/models/Guest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  await connectDb();
  const guests = await Guest.find({ userId }).lean();
  const csv = stringify(
    guests.map((guest) => [guest.name, guest.email ?? "", guest.rsvpStatus, guest.tableNumber ?? ""]),
    { header: true, columns: ["Name", "Email", "RSVP", "Table"] },
  );
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=guests.csv");
  return res.status(200).send(csv);
}
