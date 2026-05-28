import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import Wedding from "../../lib/models/Wedding.js";
import Photo from "../../lib/models/Photo.js";

const createSchema = z.object({
  url: z.string().url(),
  caption: z.string().max(200).optional(),
  uploadedBy: z.string().max(80).optional(),
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
    const items = await Photo.find().where("weddingId").equals(wedding._id).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid photo payload" });
    }
    const item = await Photo.create({
      weddingId: wedding._id,
      url: parsed.data.url,
      caption: parsed.data.caption,
      uploadedBy: parsed.data.uploadedBy,
    });
    return res.status(201).json({ item });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
