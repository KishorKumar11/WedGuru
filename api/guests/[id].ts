import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserId } from "../_utils.js";
import { connectDb } from "../../lib/db.js";
import Guest from "../../lib/models/Guest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const itemId = String(req.query.id);
  await connectDb();
  if (req.method === "PUT") {
    const item = await Guest.findOneAndUpdate({ _id: itemId, userId }, req.body, { new: true });
    return res.status(200).json({ item });
  }
  if (req.method === "DELETE") {
    await Guest.findOneAndDelete({ _id: itemId, userId });
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
