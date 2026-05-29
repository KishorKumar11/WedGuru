import type { VercelRequest, VercelResponse } from "@vercel/node";
import { routeApi } from "../lib/handlers/router.js";

function pathSegments(query: VercelRequest["query"]): string[] {
  const raw = query.path;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return routeApi(req, res, pathSegments(req.query));
}
