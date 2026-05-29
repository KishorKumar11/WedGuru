import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { PartyTask } from "../lib/types";

const ROLES = ["Best Man", "Maid of Honor", "Bridesmaid", "Groomsman", "Ring Bearer", "Flower Girl", "Family", "Custom"];

export default function PartyTasks() {
  const [tasks, setTasks] = useState<PartyTask[]>([]);
  const [draft, setDraft] = useState({ assignedTo: "Best Man", title: "", dueDate: "" });
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    const data = await apiRequest<{ items: PartyTask[] }>("/party-tasks");
    setTasks(data.items);
  }

  useEffect(() => {
    load().finally(() => setIsLoading(false));
  }, []);

  async function addTask() {
    if (!draft.title.trim()) return;
    await apiRequest("/party-tasks", {
      method: "POST",
      bodyData: {
        assignedTo: draft.assignedTo,
        title: draft.title,
        dueDate: draft.dueDate ? `${draft.dueDate}T00:00:00.000Z` : undefined,
      },
    });
    setDraft({ ...draft, title: "", dueDate: "" });
    await load();
  }

  async function toggleTask(id: string, isCompleted: boolean) {
    await apiRequest(`/party-tasks/${id}`, { method: "PUT", bodyData: { isCompleted } });
    await load();
  }

  async function deleteTask(id: string) {
    await apiRequest(`/party-tasks/${id}`, { method: "DELETE" });
    await load();
  }

  const grouped = tasks.reduce<Record<string, PartyTask[]>>((acc, t) => {
    acc[t.assignedTo] = [...(acc[t.assignedTo] ?? []), t];
    return acc;
  }, {});

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard>
        <h1 className="page-title">Party Tasks</h1>
        <p className="muted-label">Assign tasks to your wedding party — speeches, fittings, rehearsals, and more.</p>
        {tasks.length > 0 ? (
          <p style={{ marginTop: 6 }}>
            {completedCount} / {tasks.length} done
          </p>
        ) : null}
      </GlassCard>

      <GlassCard title="Add task">
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
            <select
              value={draft.assignedTo}
              onChange={(e) => setDraft((p) => ({ ...p, assignedTo: e.target.value }))}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input
              placeholder="Task description"
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") void addTask(); }}
            />
            <button className="btn btn-primary" type="button" onClick={() => void addTask()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", marginRight: 8 }}>Due date (optional)</label>
            <input type="date" value={draft.dueDate} onChange={(e) => setDraft((p) => ({ ...p, dueDate: e.target.value }))} />
          </div>
        </div>
      </GlassCard>

      {isLoading ? (
        <GlassCard><p>Loading…</p></GlassCard>
      ) : tasks.length === 0 ? (
        <GlassCard>
          <p className="muted-label">No party tasks yet. Add speeches, fittings, and rehearsal duties above.</p>
        </GlassCard>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {Object.entries(grouped).map(([role, roleTasks]) => (
            <GlassCard key={role} title={role}>
              <AnimatePresence initial={false}>
                <div style={{ display: "grid", gap: 8 }}>
                  {roleTasks.map((task) => {
                    const isOverdue = task.dueDate && !task.isCompleted && new Date(task.dueDate) < new Date();
                    return (
                      <motion.article
                        key={task._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: 10,
                          padding: "0.6rem 0.75rem",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          onChange={(e) => void toggleTask(task._id, e.target.checked)}
                        />
                        <div style={{ flex: 1 }}>
                          <span style={{ textDecoration: task.isCompleted ? "line-through" : "none", color: task.isCompleted ? "#aaa" : "inherit" }}>
                            {task.title}
                          </span>
                          {task.dueDate ? (
                            <span
                              style={{
                                marginLeft: 10,
                                fontSize: "0.78rem",
                                color: isOverdue ? "#b42318" : "#aaa",
                                fontWeight: isOverdue ? 700 : 400,
                              }}
                            >
                              {isOverdue ? "⚠ " : ""}
                              {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </span>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="btn btn-muted"
                          style={{ padding: "4px 8px" }}
                          onClick={() => void deleteTask(task._id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.article>
                    );
                  })}
                </div>
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
