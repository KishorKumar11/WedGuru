import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDb } from "../../lib/db.js";
import Guest from "../../lib/models/Guest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = String(req.query.token);
  await connectDb();
  if (req.method === "GET") {
    const guest = await Guest.findOne({ inviteToken: token }).lean();
    if (!guest) {
      return res.status(404).json({ error: "Invite not found" });
    }
    return res.status(200).json({ guest });
  }
  if (req.method === "PUT") {
    const guest = await Guest.findOneAndUpdate({ inviteToken: token }, req.body, { new: true });
    if (!guest) {
      return res.status(404).json({ error: "Invite not found" });
    }
    return res.status(200).json({ guest });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
