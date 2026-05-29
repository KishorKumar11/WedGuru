import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDb } from "../db.js";
import UserModel from "../models/User.js";
import BudgetItemModel from "../models/BudgetItem.js";
import GuestModel from "../models/Guest.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = String(req.query.token);
  await connectDb();

  const user = await UserModel.findOne({ familyToken: token }).select("name partnerName weddingDate").lean();
  if (!user) {
    return res.status(404).json({ error: "Family summary not found" });
  }

  const [budgetItems, guests] = await Promise.all([
    BudgetItemModel.find({ userId: user._id }).lean(),
    GuestModel.find({ userId: user._id }).lean(),
  ]);

  const budgetTotals = budgetItems.reduce(
    (acc, item) => ({ estimated: acc.estimated + item.estimated, actual: acc.actual + item.actual }),
    { estimated: 0, actual: 0 },
  );

  const guestCounts = {
    total: guests.length,
    accepted: guests.filter((g) => g.rsvpStatus === "accepted").length,
    declined: guests.filter((g) => g.rsvpStatus === "declined").length,
    pending: guests.filter((g) => g.rsvpStatus === "pending").length,
  };

  return res.status(200).json({
    couple: { name: user.name, partnerName: user.partnerName, weddingDate: user.weddingDate },
    budget: budgetTotals,
    guests: guestCounts,
  });
}
