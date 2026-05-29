import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDb } from "../db.js";
import Guest from "../models/Guest.js";
import Wedding from "../models/Wedding.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = String(req.query.token);
  await connectDb();

  if (req.method === "GET") {
    const guest = await Guest.findOne({ inviteToken: token }).lean();
    if (!guest) {
      return res.status(404).json({ error: "Invite not found" });
    }
    const wedding = await Wedding.findOne({ userId: guest.userId }).select("weddingDate venue").lean();
    return res.status(200).json({
      guest,
      wedding: wedding
        ? { weddingDate: wedding.weddingDate?.toISOString(), venue: wedding.venue }
        : undefined,
    });
  }

  if (req.method === "PUT") {
    const guest = await Guest.findOneAndUpdate({ inviteToken: token }, { $set: req.body }, { new: true });
    if (!guest) {
      return res.status(404).json({ error: "Invite not found" });
    }
    return res.status(200).json({ guest });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
