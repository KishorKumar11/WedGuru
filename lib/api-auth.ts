import { parse } from "cookie";
import type { VercelRequest } from "@vercel/node";
import { verifyAuthToken } from "./auth.js";
import UserModel from "./models/User.js";
import { connectDb } from "./db.js";

export function getTokenFromRequest(req: VercelRequest) {
  const cookies = parse(req.headers.cookie ?? "");
  return cookies.wedguru_token;
}

export function getUserId(req: VercelRequest): string | null {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  try {
    return verifyAuthToken(token).sub;
  } catch {
    return null;
  }
}

/**
 * Returns the effective owner userId for data queries.
 * Co-planners share data with their primary user — this resolves transparently.
 */
export async function getEffectiveUserId(req: VercelRequest): Promise<string | null> {
  const rawId = getUserId(req);
  if (!rawId) {
    return null;
  }
  try {
    await connectDb();
    const user = await UserModel.findById(rawId).select("role coplannerOf").lean();
    if (!user) {
      return null;
    }
    if (user.role === "co-planner" && user.coplannerOf) {
      return String(user.coplannerOf);
    }
    return rawId;
  } catch {
    return rawId;
  }
}
