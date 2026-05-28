import { useEffect, useMemo, useState } from "react";
import BudgetDonut from "../components/BudgetDonut";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { BudgetItem } from "../lib/types";

const categories = ["Venue", "Catering", "Photography", "Flowers", "Attire", "Music/DJ", "Decor", "Invitations", "Transport", "Honeymoon", "Miscellaneous"];

export default function Budget() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [draft, setDraft] = useState({ category: "Venue", vendor: "", estimated: "0", actual: "0" });

  async function loadItems() {
    const data = await apiRequest<{ items: BudgetItem[] }>("/budget");
    setItems(data.items);
  }

  useEffect(() => {
    loadItems();
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

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Budget Summary">
        <p>Estimated: ${totals.estimated.toFixed(2)} | Actual: ${totals.actual.toFixed(2)}</p>
      </GlassCard>
      <GlassCard title="Spending by category">
        <BudgetDonut items={items} />
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
            </article>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
