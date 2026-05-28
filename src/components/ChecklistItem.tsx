import type { ChecklistItem as ChecklistItemType } from "../lib/types";

export default function ChecklistItem({
  item,
  onToggle,
  onDelete,
}: {
  item: ChecklistItemType;
  onToggle: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "white",
        borderRadius: 12,
        padding: "0.7rem",
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" checked={item.isCompleted} onChange={(event) => onToggle(item._id, event.target.checked)} />
        <span style={{ textDecoration: item.isCompleted ? "line-through" : "none" }}>{item.title}</span>
      </label>
      <button className="btn btn-muted" onClick={() => onDelete(item._id)} type="button">
        Remove
      </button>
    </article>
  );
}
