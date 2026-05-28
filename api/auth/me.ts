import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import User from "../../lib/models/User.js";

const updateSchema = z.object({
  partnerName: z.string().trim().min(1).max(80).optional(),
  weddingDate: z.string().datetime().optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const userObjectId = new Types.ObjectId(userId);

  if (req.method === "GET") {
    const user = await User.findById(userObjectId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.status(200).json({ user });
  }

  if (req.method === "PUT") {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid profile payload" });
    }
    const nextValues: Record<string, unknown> = {};
    if (parsed.data.partnerName !== undefined) {
      nextValues.partnerName = parsed.data.partnerName;
    }
    if (parsed.data.weddingDate !== undefined) {
      nextValues.weddingDate = new Date(parsed.data.weddingDate);
    }
    const user = await User.findByIdAndUpdate(userObjectId, nextValues, { new: true }).select("-password");
    return res.status(200).json({ user });
  }

  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      "aisle_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax" + (process.env.NODE_ENV === "production" ? "; Secure" : ""),
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
