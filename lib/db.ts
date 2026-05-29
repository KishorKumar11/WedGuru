import mongoose from "mongoose";

export const DB_CONFIG_ERROR =
  "Server misconfigured: MONGODB_URI is not set. Add it under Vercel → Project → Settings → Environment Variables, then redeploy.";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(DB_CONFIG_ERROR);
  }
  return uri;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDb() {
  if (cache.conn) {
    return cache.conn;
  }
  if (!cache.promise) {
    cache.promise = mongoose.connect(getMongoUri());
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
