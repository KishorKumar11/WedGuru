import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserId } from "../_utils";
import { connectDb } from "../../lib/db";
import User from "../../lib/models/User";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.status(200).json({ user });
}
