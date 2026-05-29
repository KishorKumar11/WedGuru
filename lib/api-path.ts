/** Path segments from Vercel catch-all `api/[...path].ts` query. */
export function pathSegmentsFromQuery(pathQuery: string | string[] | undefined): string[] {
  if (!pathQuery) {
    return [];
  }
  const parts = Array.isArray(pathQuery) ? pathQuery : [pathQuery];
  return parts.flatMap((segment) => segment.split("/").filter(Boolean));
}
