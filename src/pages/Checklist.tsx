import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChecklistItem from "../components/ChecklistItem";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import { checklistTemplates } from "../lib/checklist-templates";
import type { ChecklistItem as ChecklistItemType } from "../lib/types";

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  async function loadItems() {
    const data = await apiRequest<{ items: ChecklistItemType[] }>("/checklist");
    setItems(data.items);
  }

  useEffect(() => {
    loadItems().finally(() => setIsLoading(false));
  }, []);

  const completedPercent = useMemo(() => {
    if (!items.length) {
      return 0;
    }
    const completedCount = items.filter((item) => item.isCompleted).length;
    return Math.round((completedCount / items.length) * 100);
  }, [items]);

  const groupedItems = useMemo(() => {
    return items.reduce<Record<string, ChecklistItemType[]>>((acc, item) => {
      const group = item.monthsBefore || "custom";
      const groupItems = acc[group] ?? [];
      groupItems.push(item);
      acc[group] = groupItems;
      return acc;
    }, {});
  }, [items]);

  async function loadTemplate() {
    await Promise.all(
      checklistTemplates.map((template) =>
        apiRequest("/checklist", {
          method: "POST",
          bodyData: template,
        }),
      ),
    );
    await loadItems();
  }

  async function addTask() {
    if (!newTitle.trim()) {
      return;
    }
    await apiRequest("/checklist", {
      method: "POST",
      bodyData: {
        title: newTitle,
        category: "Custom",
        monthsBefore: "custom",
        order: items.length + 1,
      },
    });
    setNewTitle("");
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

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Smart Checklist">
        <p>Progress: {completedPercent}% complete</p>
        {!items.length ? (
          <button className="btn btn-primary" type="button" onClick={() => void loadTemplate()}>
            Load wedding template
          </button>
        ) : null}
      </GlassCard>

      <GlassCard title="Add task">
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Task title"
            style={{ flex: 1, padding: 10 }}
          />
          <button className="btn btn-primary" type="button" onClick={() => void addTask()}>
            Add
          </button>
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
                        <ChecklistItem key={item._id} item={item} onToggle={toggleTask} onDelete={deleteTask} />
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
