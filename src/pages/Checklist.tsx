import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChecklistItem from "../components/ChecklistItem";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import { checklistTemplates } from "../lib/checklist-templates";
import type { ChecklistItem as ChecklistItemType } from "../lib/types";

const ASSIGNEES = ["Primary Planner", "Co-Planner", "Best Man", "Maid of Honor", "Family"];

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [filterAssignee, setFilterAssignee] = useState("all");

  async function loadItems() {
    const data = await apiRequest<{ items: ChecklistItemType[] }>("/checklist");
    setItems(data.items);
  }

  useEffect(() => {
    loadItems().finally(() => setIsLoading(false));
  }, []);

  const completedPercent = useMemo(() => {
    if (!items.length) return 0;
    return Math.round((items.filter((i) => i.isCompleted).length / items.length) * 100);
  }, [items]);

  const overdueCount = useMemo(
    () => items.filter((i) => !i.isCompleted && i.dueDate && new Date(i.dueDate) < new Date()).length,
    [items],
  );

  const filteredItems = useMemo(
    () => (filterAssignee === "all" ? items : items.filter((i) => i.assignee === filterAssignee)),
    [items, filterAssignee],
  );

  const groupedItems = useMemo(
    () =>
      filteredItems.reduce<Record<string, ChecklistItemType[]>>((acc, item) => {
        const group = item.monthsBefore || "custom";
        acc[group] = [...(acc[group] ?? []), item];
        return acc;
      }, {}),
    [filteredItems],
  );

  async function loadTemplate() {
    await Promise.all(checklistTemplates.map((t) => apiRequest("/checklist", { method: "POST", bodyData: t })));
    await loadItems();
  }

  async function addTask() {
    if (!newTitle.trim()) return;
    await apiRequest("/checklist", {
      method: "POST",
      bodyData: {
        title: newTitle,
        category: "Custom",
        monthsBefore: "custom",
        order: items.length + 1,
        assignee: newAssignee || undefined,
        dueDate: newDueDate ? `${newDueDate}T00:00:00.000Z` : undefined,
      },
    });
    setNewTitle("");
    setNewAssignee("");
    setNewDueDate("");
    await loadItems();
  }

  async function toggleTask(id: string, value: boolean) {
    await apiRequest(`/checklist/${id}`, { method: "PUT", bodyData: { isCompleted: value } });
    await loadItems();
  }

  async function deleteTask(id: string) {
    await apiRequest(`/checklist/${id}`, { method: "DELETE" });
    await loadItems();
  }

  async function updateTask(id: string, patch: { assignee?: string | null; dueDate?: string | null }) {
    await apiRequest(`/checklist/${id}`, { method: "PUT", bodyData: patch });
    await loadItems();
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Smart Checklist">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <p style={{ margin: 0 }}>Progress: {completedPercent}%</p>
          {overdueCount > 0 ? (
            <span style={{ color: "#b42318", fontWeight: 700, fontSize: "0.88rem" }}>
              ⚠ {overdueCount} overdue
            </span>
          ) : null}
        </div>
        {!items.length ? (
          <button className="btn btn-primary" type="button" onClick={() => void loadTemplate()} style={{ marginTop: 10 }}>
            Load wedding template
          </button>
        ) : null}
      </GlassCard>

      <GlassCard title="Add task">
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              style={{ flex: 1, padding: 10 }}
              onKeyDown={(e) => { if (e.key === "Enter") void addTask(); }}
            />
            <button className="btn btn-primary" type="button" onClick={() => void addTask()}>
              Add
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 8, fontSize: "0.88rem" }}
            >
              <option value="">Assignee (optional)</option>
              {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              style={{ padding: "6px 8px", borderRadius: 8, fontSize: "0.88rem" }}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Filter">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", ...ASSIGNEES].map((a) => (
            <button
              key={a}
              className={filterAssignee === a ? "btn btn-primary" : "btn btn-muted"}
              type="button"
              style={{ fontSize: "0.82rem" }}
              onClick={() => setFilterAssignee(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Tasks">
        {isLoading ? (
          <p>Loading checklist...</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <section key={group} className="glass" style={{ padding: "0.8rem" }}>
                <button
                  type="button"
                  className="btn btn-muted"
                  style={{ marginBottom: 8 }}
                  onClick={() => setCollapsedGroups((prev) => ({ ...prev, [group]: !prev[group] }))}
                >
                  {collapsedGroups[group] ? "Show" : "Hide"} {group}
                </button>
                <AnimatePresence initial={false}>
                  {!collapsedGroups[group] ? (
                    <motion.div
                      key={group}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      style={{ display: "grid", gap: 10 }}
                    >
                      {groupItems.map((item) => (
                        <ChecklistItem
                          key={item._id}
                          item={item}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                          onUpdate={updateTask}
                        />
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </section>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
