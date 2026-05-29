import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { getUserId } from "../api-auth.js";
import { connectDb } from "../db.js";
import UserModel from "../models/User.js";
import GuestModel from "../models/Guest.js";
import BudgetItemModel from "../models/BudgetItem.js";
import ChecklistItemModel from "../models/ChecklistItem.js";

const inviteSchema = z.object({
  coupleEmail: z.string().email().toLowerCase().trim(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectDb();
  const planner = await UserModel.findById(userId).lean();

  if (!planner || planner.role !== "planner-pro") {
    return res.status(403).json({ error: "Planner Pro role required" });
  }

  if (req.method === "GET") {
    const couples = await UserModel.find({
      _id: { $in: planner.managedCouples ?? [] },
    })
      .select("name partnerName weddingDate email")
      .lean();

    const summary = await Promise.all(
      couples.map(async (couple) => {
        const [guestCount, budgetItems, checklistItems] = await Promise.all([
          GuestModel.countDocuments({ userId: couple._id }),
          BudgetItemModel.find({ userId: couple._id }).lean(),
          ChecklistItemModel.countDocuments({ userId: couple._id, isCompleted: false }),
        ]);
        const spend = budgetItems.reduce((acc, b) => acc + b.actual, 0);
        return { ...couple, guestCount, totalSpend: spend, pendingTasks: checklistItems };
      }),
    );

    return res.status(200).json({ couples: summary });
  }

  if (req.method === "POST") {
    const parsed = inviteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const couple = await UserModel.findOne({ email: parsed.data.coupleEmail }).lean();
    if (!couple) {
      return res.status(404).json({ error: "Couple not found — they must register first" });
    }
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { managedCouples: couple._id },
    });
    return res.status(200).json({ ok: true, coupleId: couple._id });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
