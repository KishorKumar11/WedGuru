import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Types } from "mongoose";
import { z } from "zod";
import { getUserId } from "../../lib/api-auth.js";
import { connectDb } from "../../lib/db.js";
import UserModel from "../../lib/models/User.js";
import GuestModel from "../../lib/models/Guest.js";
import BudgetItemModel from "../../lib/models/BudgetItem.js";
import ChecklistItemModel from "../../lib/models/ChecklistItem.js";
import ActivityLogModel from "../../lib/models/ActivityLog.js";

const querySchema = z.object({
  coupleId: z.string().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Missing coupleId" });
  }

  await connectDb();
  const planner = await UserModel.findById(userId).select("role managedCouples").lean();

  if (!planner || planner.role !== "planner-pro") {
    return res.status(403).json({ error: "Planner Pro role required" });
  }

  const coupleObjectId = new Types.ObjectId(parsed.data.coupleId);
  const isManaged = (planner.managedCouples ?? []).some((id) => String(id) === parsed.data.coupleId);
  if (!isManaged) {
    return res.status(403).json({ error: "Access denied to this couple" });
  }

  const [couple, guests, budgetItems, pendingTasks, recentActivity] = await Promise.all([
    UserModel.findById(coupleObjectId).select("name partnerName weddingDate").lean(),
    GuestModel.find({ userId: coupleObjectId }).lean(),
    BudgetItemModel.find({ userId: coupleObjectId }).lean(),
    ChecklistItemModel.find({ userId: coupleObjectId, isCompleted: false }).sort({ order: 1 }).limit(5).lean(),
    ActivityLogModel.find({ userId: coupleObjectId }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  if (!couple) {
    return res.status(404).json({ error: "Couple not found" });
  }

  const guestCounts = {
    total: guests.length,
    accepted: guests.filter((g) => g.rsvpStatus === "accepted").length,
    pending: guests.filter((g) => g.rsvpStatus === "pending").length,
  };
  const budgetTotals = budgetItems.reduce(
    (acc, b) => ({ estimated: acc.estimated + b.estimated, actual: acc.actual + b.actual }),
    { estimated: 0, actual: 0 },
  );

  return res.status(200).json({ couple, guestCounts, budgetTotals, pendingTasks, recentActivity });
}
