import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { BudgetItem } from "../lib/types";

const categories = ["Venue", "Catering", "Photography", "Flowers", "Attire", "Music/DJ", "Decor", "Invitations", "Transport", "Honeymoon", "Miscellaneous"];
const BudgetDonut = lazy(() => import("../components/BudgetDonut"));

const DEFAULT_CAP_PERCENT = 0.2;

function categoryBudgetCap(category: string, total: number): number {
  const caps: Record<string, number> = {
    Venue: 0.35,
    Catering: 0.25,
    Photography: 0.12,
    Flowers: 0.08,
    Attire: 0.1,
    "Music/DJ": 0.06,
    Decor: 0.08,
    Invitations: 0.03,
    Transport: 0.04,
    Honeymoon: 0.15,
    Miscellaneous: 0.05,
  };
  return total * (caps[category] ?? DEFAULT_CAP_PERCENT);
}

export default function Budget() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [draft, setDraft] = useState({ category: "Venue", vendor: "", estimated: "0", actual: "0", notes: "" });
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

  const totals = useMemo(
    () => items.reduce((acc, i) => ({ estimated: acc.estimated + i.estimated, actual: acc.actual + i.actual }), { estimated: 0, actual: 0 }),
    [items],
  );

  const byCategory = useMemo(() => {
    return categories
      .map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        const actual = catItems.reduce((s, i) => s + i.actual, 0);
        const cap = categoryBudgetCap(cat, Number(totalBudget));
        return { cat, actual, cap, items: catItems };
      })
      .filter((c) => c.items.length > 0);
  }, [items, totalBudget]);

  async function addExpense() {
    if (!draft.vendor.trim()) return;
    await apiRequest("/budget", {
      method: "POST",
      bodyData: {
        category: draft.category,
        vendor: draft.vendor,
        estimated: Number(draft.estimated),
        actual: Number(draft.actual),
        notes: draft.notes || undefined,
      },
    });
    setDraft({ category: draft.category, vendor: "", estimated: "0", actual: "0", notes: "" });
    await loadItems();
  }

  async function togglePaid(id: string, paid: boolean) {
    await apiRequest(`/budget/${id}`, { method: "PUT", bodyData: { paid } });
    await loadItems();
  }

  async function deleteItem(id: string) {
    await apiRequest(`/budget/${id}`, { method: "DELETE" });
    await loadItems();
  }

  async function saveBudgetTarget() {
    await apiRequest("/wedding", { method: "PUT", bodyData: { budgetTotal: Number(totalBudget) || 0 } });
  }

  const remaining = Number(totalBudget) - totals.actual;
  const overBudget = remaining < 0;
  const nearLimit = !overBudget && remaining < Number(totalBudget) * 0.1;
  const budgetState = overBudget
    ? { label: "Over budget", color: "#b42318", icon: AlertTriangle }
    : nearLimit
      ? { label: "Near limit (< 10% left)", color: "#b54708", icon: TrendingUp }
      : { label: "On track", color: "#027a48", icon: CheckCircle };

  const BudgetIcon = budgetState.icon;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Budget Summary">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label htmlFor="totalBudget">Total budget</label>
          <input
            id="totalBudget"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            style={{ width: 140, padding: 8 }}
          />
          <button className="btn btn-muted" type="button" onClick={() => void saveBudgetTarget()}>
            Save target
          </button>
        </div>
        <p style={{ marginTop: 8 }}>Estimated: ${totals.estimated.toFixed(2)} | Actual: ${totals.actual.toFixed(2)}</p>
        <p>Remaining: ${remaining.toFixed(2)}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <BudgetIcon size={16} style={{ color: budgetState.color }} />
          <strong style={{ color: budgetState.color }}>{budgetState.label}</strong>
        </div>
      </GlassCard>

      <GlassCard title="Spending by category">
        <Suspense fallback={<p className="muted-label">Loading chart...</p>}>
          <BudgetDonut items={items} />
        </Suspense>
      </GlassCard>

      {byCategory.length > 0 ? (
        <GlassCard title="Category alerts">
          <div style={{ display: "grid", gap: 8 }}>
            {byCategory.map(({ cat, actual, cap }) => {
              const pct = cap > 0 ? (actual / cap) * 100 : 0;
              const over = actual > cap;
              const near = !over && pct > 80;
              return (
                <div
                  key={cat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    borderRadius: 8,
                    background: over ? "rgba(180,35,24,0.07)" : near ? "rgba(181,71,8,0.07)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span>{cat}</span>
                  <span style={{ fontSize: "0.85rem" }}>
                    ${actual.toFixed(0)} / ${cap.toFixed(0)} cap
                  </span>
                  {over ? (
                    <span style={{ color: "#b42318", fontSize: "0.8rem", fontWeight: 700 }}>OVER</span>
                  ) : near ? (
                    <span style={{ color: "#b54708", fontSize: "0.8rem", fontWeight: 700 }}>NEAR</span>
                  ) : (
                    <span style={{ color: "#027a48", fontSize: "0.8rem" }}>OK</span>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      ) : null}

      <GlassCard title="Add expense">
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8 }}>
            <select value={draft.category} onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input placeholder="Vendor" value={draft.vendor} onChange={(e) => setDraft((prev) => ({ ...prev, vendor: e.target.value }))} />
            <input placeholder="Estimated" value={draft.estimated} onChange={(e) => setDraft((prev) => ({ ...prev, estimated: e.target.value }))} />
            <input placeholder="Actual" value={draft.actual} onChange={(e) => setDraft((prev) => ({ ...prev, actual: e.target.value }))} />
            <button className="btn btn-primary" type="button" onClick={() => void addExpense()}>Add</button>
          </div>
          <input placeholder="Notes (optional)" value={draft.notes} onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))} />
        </div>
      </GlassCard>

      <GlassCard title="Expenses">
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((item) => (
            <article
              key={item._id}
              style={{ background: "white", borderRadius: 12, padding: "0.75rem", display: "grid", gap: 4 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong>{item.category}</strong> — {item.vendor}
                  {item.notes ? <p className="muted-label" style={{ margin: "2px 0 0", fontSize: "0.82rem" }}>{item.notes}</p> : null}
                </div>
                <button
                  className="btn btn-muted"
                  type="button"
                  style={{ fontSize: "0.78rem", padding: "2px 8px" }}
                  onClick={() => void deleteItem(item._id)}
                >
                  Remove
                </button>
              </div>
              <div style={{ fontSize: "0.9rem" }}>
                Estimated ${item.estimated.toFixed(2)} | Actual ${item.actual.toFixed(2)}
              </div>
              <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={item.paid}
                  onChange={(e) => void togglePaid(item._id, e.target.checked)}
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
