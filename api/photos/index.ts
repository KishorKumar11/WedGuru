import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "crypto";
import { Types } from "mongoose";
import { z } from "zod";
import { getEffectiveUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import Wedding from "../../lib/models/Wedding.js";
import Photo from "../../lib/models/Photo.js";
import UserModel from "../../lib/models/User.js";

const createSchema = z.object({
  url: z.string().url(),
  caption: z.string().max(200).optional(),
  uploadedBy: z.string().max(80).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = await getEffectiveUserId(req);
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
    const showPending = req.query.pending === "true";
    const query = Photo.find().where("weddingId").equals(wedding._id).sort({ createdAt: -1 });
    if (!showPending) {
      query.where("approved").ne(false);
    }
    const items = await query;
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
      approved: true,
    });
    return res.status(201).json({ item });
  }

  if (req.method === "PUT") {
    const photoId = req.query.photoId;
    if (!photoId || !Types.ObjectId.isValid(String(photoId))) {
      return res.status(400).json({ error: "Missing photoId" });
    }
    const photo = await Photo.findOneAndUpdate(
      { _id: photoId, weddingId: wedding._id },
      { $set: { approved: req.body.approved } },
      { new: true },
    );
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    return res.status(200).json({ item: photo });
  }

  if (req.method === "DELETE") {
    const photoId = req.query.photoId;
    if (!photoId || !Types.ObjectId.isValid(String(photoId))) {
      return res.status(400).json({ error: "Missing photoId" });
    }
    await Photo.findOneAndDelete({ _id: photoId, weddingId: wedding._id });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "PATCH" && req.query.action === "party-token") {
    const token = randomBytes(20).toString("hex");
    await UserModel.findByIdAndUpdate(userId, { partyUploadToken: token });
    return res.status(200).json({ token });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
