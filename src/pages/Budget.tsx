import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { BudgetItem } from "../lib/types";

const categories = ["Venue", "Catering", "Photography", "Flowers", "Attire", "Music/DJ", "Decor", "Invitations", "Transport", "Honeymoon", "Miscellaneous"];
const BudgetDonut = lazy(() => import("../components/BudgetDonut"));

export default function Budget() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [draft, setDraft] = useState({ category: "Venue", vendor: "", estimated: "0", actual: "0" });
  const [totalBudget, setTotalBudget] = useState("20000");

  async function loadItems() {
    const data = await apiRequest<{ items: BudgetItem[] }>("/budget");
    setItems(data.items);
  }

  useEffect(() => {
    loadItems();
    apiRequest<{ wedding: { budgetTotal?: number } }>("/wedding")
      .then((data) => {
        if (typeof data.wedding?.budgetTotal === "number" && data.wedding.budgetTotal > 0) {
          setTotalBudget(String(data.wedding.budgetTotal));
        }
      })
      .catch(() => undefined);
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => ({ estimated: acc.estimated + item.estimated, actual: acc.actual + item.actual }),
      { estimated: 0, actual: 0 },
    );
  }, [items]);

  async function addExpense() {
    await apiRequest("/budget", {
      method: "POST",
      bodyData: {
        category: draft.category,
        vendor: draft.vendor,
        estimated: Number(draft.estimated),
        actual: Number(draft.actual),
      },
    });
    setDraft({ category: draft.category, vendor: "", estimated: "0", actual: "0" });
    await loadItems();
  }

  async function togglePaid(itemId: string, paid: boolean) {
    await apiRequest(`/budget/${itemId}`, { method: "PUT", bodyData: { paid } });
    await loadItems();
  }

  async function saveBudgetTarget() {
    await apiRequest("/wedding", {
      method: "PUT",
      bodyData: { budgetTotal: Number(totalBudget) || 0 },
    });
  }

  const remainingBudget = Number(totalBudget) - totals.actual;
  const budgetState =
    remainingBudget < 0 ? { label: "Over budget", color: "#b42318" } : remainingBudget < Number(totalBudget) * 0.15 ? { label: "Near limit", color: "#b54708" } : { label: "On track", color: "#027a48" };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Budget Summary">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="totalBudget">Total budget</label>
          <input
            id="totalBudget"
            value={totalBudget}
            onChange={(event) => setTotalBudget(event.target.value)}
            style={{ width: 140, padding: 8 }}
          />
          <button className="btn btn-muted" type="button" onClick={() => void saveBudgetTarget()}>
            Save target
          </button>
        </div>
        <p>Estimated: ${totals.estimated.toFixed(2)} | Actual: ${totals.actual.toFixed(2)}</p>
        <p>Remaining: ${remainingBudget.toFixed(2)}</p>
        <p style={{ color: budgetState.color, fontWeight: 700 }}>{budgetState.label}</p>
      </GlassCard>
      <GlassCard title="Spending by category">
        <Suspense fallback={<p className="muted-label">Loading chart...</p>}>
          <BudgetDonut items={items} />
        </Suspense>
      </GlassCard>
      <GlassCard title="Add expense">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8 }}>
          <select value={draft.category} onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input placeholder="Vendor" value={draft.vendor} onChange={(event) => setDraft((prev) => ({ ...prev, vendor: event.target.value }))} />
          <input placeholder="Estimated" value={draft.estimated} onChange={(event) => setDraft((prev) => ({ ...prev, estimated: event.target.value }))} />
          <input placeholder="Actual" value={draft.actual} onChange={(event) => setDraft((prev) => ({ ...prev, actual: event.target.value }))} />
          <button className="btn btn-primary" type="button" onClick={() => void addExpense()}>
            Add
          </button>
        </div>
      </GlassCard>
      <GlassCard title="Expenses">
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((item) => (
            <article key={item._id} style={{ background: "white", borderRadius: 12, padding: "0.75rem" }}>
              <strong>{item.category}</strong> - {item.vendor}
              <div>Estimated ${item.estimated.toFixed(2)} | Actual ${item.actual.toFixed(2)}</div>
              <label style={{ display: "inline-flex", gap: 6, alignItems: "center", marginTop: 6 }}>
                <input
                  type="checkbox"
                  checked={item.paid}
                  onChange={(event) => {
                    void togglePaid(item._id, event.target.checked);
                  }}
                />
                Paid
              </label>
            </article>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
