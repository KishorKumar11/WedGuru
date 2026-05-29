import { Types } from "mongoose";
import ActivityLogModel from "./models/ActivityLog.js";

export async function logActivity(userId: string, action: string, detail: string): Promise<void> {
  try {
    await ActivityLogModel.create({ userId: new Types.ObjectId(userId), action, detail });
  } catch {
    // Non-critical — never let logging break the main operation
  }
}
