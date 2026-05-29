import type { VercelRequest, VercelResponse } from "@vercel/node";
import { pathSegmentsFromQuery } from "../lib/api-path.js";
import { routeApi } from "../lib/handlers/router.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const raw = req.query.path;
  const pathQuery = typeof raw === "string" || Array.isArray(raw) ? raw : undefined;
  return routeApi(req, res, pathSegmentsFromQuery(pathQuery));
}
