import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

const TABLES = [1, 2, 3, 4, 5, 6, 7, 8];
const TABLE_CAPACITY = 8;

function hasConflict(guestA: Guest, guestB: Guest): boolean {
  if (!guestA.conflictWith && !guestB.conflictWith) return false;
  return (
    (guestA.conflictWith ?? []).includes(guestB._id) ||
    (guestB.conflictWith ?? []).includes(guestA._id)
  );
}

function getTableConflicts(tableGuests: Guest[]): string[] {
  const conflicts: string[] = [];
  for (let i = 0; i < tableGuests.length; i++) {
    for (let j = i + 1; j < tableGuests.length; j++) {
      const a = tableGuests[i];
      const b = tableGuests[j];
      if (a && b && hasConflict(a, b)) {
        conflicts.push(`${a.name} ↔ ${b.name}`);
      }
    }
  }
  return conflicts;
}

export default function Seating() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [draggingGuestId, setDraggingGuestId] = useState<string | null>(null);

  async function loadGuests() {
    const data = await apiRequest<{ items: Guest[] }>("/guests");
    setGuests(data.items);
  }

  useEffect(() => {
    void loadGuests();
  }, []);

  const unassigned = useMemo(() => guests.filter((g) => !g.tableNumber), [guests]);

  const tableMap = useMemo(
    () =>
      TABLES.reduce<Record<number, Guest[]>>((acc, t) => {
        acc[t] = guests.filter((g) => g.tableNumber === t);
        return acc;
      }, {}),
    [guests],
  );

  async function assignTable(guestId: string, tableNumber?: number) {
    await apiRequest(`/guests/${guestId}`, { method: "PUT", bodyData: { tableNumber: tableNumber ?? null } });
    await loadGuests();
  }

  function onDrop(tableNumber: number) {
    if (!draggingGuestId) return;
    void assignTable(draggingGuestId, tableNumber);
    setDraggingGuestId(null);
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard title="Seating Chart">
        <p className="muted-label">Drag guests into tables. Conflicts and overflows flagged automatically.</p>
        <p className="muted-label">Table capacity: {TABLE_CAPACITY} seats</p>
      </GlassCard>

      <GlassCard title="Unassigned guests">
        {unassigned.length === 0 ? (
          <p className="muted-label">All guests assigned!</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {unassigned.map((guest) => (
              <div
                key={guest._id}
                draggable
                onDragStart={() => setDraggingGuestId(guest._id)}
                style={{
                  background: "rgba(200,149,110,0.15)",
                  borderRadius: 8,
                  padding: "5px 12px",
                  cursor: "grab",
                  fontSize: "0.88rem",
                  userSelect: "none",
                }}
              >
                {guest.name}
                {guest.seatTags?.map((tag) => (
                  <span
                    key={tag}
                    style={{ marginLeft: 6, fontSize: "0.72rem", background: "rgba(0,0,0,0.08)", borderRadius: 99, padding: "1px 6px" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <div className="responsive-grid-3" style={{ alignItems: "start" }}>
        {TABLES.map((table) => {
          const tableGuests = tableMap[table] ?? [];
          const conflicts = getTableConflicts(tableGuests);
          const overCapacity = tableGuests.length > TABLE_CAPACITY;

          return (
            <section
              key={table}
              className="glass"
              style={{
                padding: "1rem",
                minHeight: 140,
                border: conflicts.length > 0 || overCapacity ? "2px solid #b42318" : "2px solid transparent",
                borderRadius: 14,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(table)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Table {table}</h3>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: overCapacity ? "#b42318" : tableGuests.length === TABLE_CAPACITY ? "#b54708" : "#aaa",
                  }}
                >
                  {tableGuests.length}/{TABLE_CAPACITY}
                </span>
              </div>

              {conflicts.length > 0 ? (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 6 }}>
                  <AlertTriangle size={13} style={{ color: "#b42318", flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: "0.76rem", color: "#b42318" }}>
                    {conflicts.map((c) => <div key={c}>{c}</div>)}
                  </div>
                </div>
              ) : null}

              <div style={{ display: "grid", gap: 5 }}>
                {tableGuests.map((guest) => (
                  <div
                    key={guest._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 7,
                      padding: "4px 8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span>
                      {guest.name}
                      {guest.seatTags?.map((tag) => (
                        <span key={tag} style={{ marginLeft: 4, fontSize: "0.7rem", background: "rgba(200,149,110,0.2)", borderRadius: 99, padding: "1px 5px" }}>
                          {tag}
                        </span>
                      ))}
                    </span>
                    <button
                      type="button"
                      style={{ fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}
                      onClick={() => void assignTable(guest._id, undefined)}
                      title="Remove from table"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
