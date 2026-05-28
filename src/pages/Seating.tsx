import { useEffect, useMemo, useState } from "react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

const tables = [1, 2, 3, 4, 5, 6];

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

  const unassignedGuests = useMemo(() => guests.filter((guest) => !guest.tableNumber), [guests]);

  async function assignTable(guestId: string, tableNumber?: number) {
    await apiRequest(`/guests/${guestId}`, { method: "PUT", bodyData: { tableNumber } });
    await loadGuests();
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard title="Seating Chart">
        <p className="muted-label">Drag unassigned guests into table cards.</p>
      </GlassCard>
      <GlassCard title="Unassigned guests">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {unassignedGuests.map((guest) => (
            <button
              key={guest._id}
              className="btn btn-muted"
              type="button"
              draggable
              onDragStart={() => setDraggingGuestId(guest._id)}
            >
              {guest.name}
            </button>
          ))}
        </div>
      </GlassCard>
      <div className="responsive-grid-3">
        {tables.map((table) => (
          <section
            key={table}
            className="glass"
            style={{ padding: "1rem", minHeight: 140 }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingGuestId) {
                void assignTable(draggingGuestId, table);
                setDraggingGuestId(null);
              }
            }}
          >
            <h3 style={{ marginTop: 0 }}>Table {table}</h3>
            <div style={{ display: "grid", gap: 6 }}>
              {guests
                .filter((guest) => guest.tableNumber === table)
                .map((guest) => (
                  <button key={guest._id} className="btn btn-muted" type="button" onClick={() => void assignTable(guest._id, undefined)}>
                    {guest.name} (remove)
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
