import { useState } from "react";
import { User, Calendar, Pencil, X, Check } from "lucide-react";
import type { ChecklistItem as ChecklistItemType } from "../lib/types";

const ASSIGNEES = ["Primary Planner", "Co-Planner", "Best Man", "Maid of Honor", "Family"];

interface Props {
  item: ChecklistItemType;
  onToggle: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: { assignee?: string | null; dueDate?: string | null }) => void;
}

export default function ChecklistItem({ item, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [assignee, setAssignee] = useState(item.assignee ?? "");
  const [dueDate, setDueDate] = useState(item.dueDate ? item.dueDate.slice(0, 10) : "");

  function saveEdit() {
    onUpdate(item._id, {
      assignee: assignee || null,
      dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null,
    });
    setEditing(false);
  }

  const dueDateLabel = item.dueDate ? new Date(item.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : null;
  const isOverdue = item.dueDate && !item.isCompleted && new Date(item.dueDate) < new Date();

  return (
    <article
      style={{
        background: "white",
        borderRadius: 12,
        padding: "0.7rem 0.75rem",
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer" }}>
          <input type="checkbox" checked={item.isCompleted} onChange={(e) => onToggle(item._id, e.target.checked)} />
          <span style={{ textDecoration: item.isCompleted ? "line-through" : "none", color: item.isCompleted ? "#aaa" : "inherit" }}>
            {item.title}
          </span>
        </label>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="btn btn-muted"
            type="button"
            title="Edit assignee / due date"
            style={{ padding: "4px 8px" }}
            onClick={() => setEditing((v) => !v)}
          >
            <Pencil size={13} />
          </button>
          <button className="btn btn-muted" type="button" style={{ padding: "4px 8px" }} onClick={() => onDelete(item._id)}>
            <X size={13} />
          </button>
        </div>
      </div>

      {(item.assignee || dueDateLabel) && !editing ? (
        <div style={{ display: "flex", gap: 12, paddingLeft: 26, fontSize: "0.8rem" }}>
          {item.assignee ? (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#888" }}>
              <User size={11} />
              {item.assignee}
            </span>
          ) : null}
          {dueDateLabel ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: isOverdue ? "#b42318" : "#888",
                fontWeight: isOverdue ? 700 : 400,
              }}
            >
              <Calendar size={11} />
              {isOverdue ? "Overdue — " : ""}
              {dueDateLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      {editing ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 26, flexWrap: "wrap" }}>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            style={{ fontSize: "0.85rem", padding: "3px 6px", borderRadius: 6 }}
          >
            <option value="">Unassigned</option>
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ fontSize: "0.85rem", padding: "3px 6px", borderRadius: 6 }}
          />
          <button className="btn btn-primary" type="button" style={{ padding: "4px 10px", fontSize: "0.82rem" }} onClick={saveEdit}>
            <Check size={12} />
          </button>
          <button className="btn btn-muted" type="button" style={{ padding: "4px 8px", fontSize: "0.82rem" }} onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      ) : null}
    </article>
  );
}
