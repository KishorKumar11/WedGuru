import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { connectDb } from "../../lib/db.js";
import UserModel from "../../lib/models/User.js";
import WeddingModel from "../../lib/models/Wedding.js";
import Photo from "../../lib/models/Photo.js";

const schema = z.object({
  token: z.string().min(1),
  url: z.string().url(),
  caption: z.string().max(200).optional(),
  uploadedBy: z.string().max(80).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  await connectDb();
  const user = await UserModel.findOne({ partyUploadToken: parsed.data.token }).select("_id").lean();
  if (!user) {
    return res.status(403).json({ error: "Invalid party upload token" });
  }

  const wedding = await WeddingModel.findOne({ userId: user._id });
  if (!wedding) {
    return res.status(404).json({ error: "Wedding not found" });
  }

  const photo = await Photo.create({
    weddingId: wedding._id,
    url: parsed.data.url,
    caption: parsed.data.caption,
    uploadedBy: parsed.data.uploadedBy ?? "Wedding Guest",
    approved: false,
  });

  return res.status(201).json({ item: photo });
}
