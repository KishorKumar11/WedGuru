import type { VercelRequest, VercelResponse } from "@vercel/node";
import { pathSegmentsFromQuery } from "../lib/api-path.js";
import { routeApi } from "../lib/handlers/router.js";

function segmentsFromRequest(req: VercelRequest): string[] {
  const raw = req.query.path;
  if (typeof raw === "string" || Array.isArray(raw)) {
    return pathSegmentsFromQuery(raw);
  }

  const pathname = (req.url ?? "").split("?")[0];
  const apiPrefix = "/api/";
  if (pathname.startsWith(apiPrefix)) {
    return pathSegmentsFromQuery(pathname.slice(apiPrefix.length));
  }
  if (pathname === "/api") {
    return [];
  }

  return [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return routeApi(req, res, segmentsFromRequest(req));
}
