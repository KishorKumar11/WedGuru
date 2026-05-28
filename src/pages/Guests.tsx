import { useEffect, useMemo, useState } from "react";
import GuestRow from "../components/GuestRow";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [filter, setFilter] = useState<Guest["rsvpStatus"] | "all">("all");

  async function loadGuests() {
    const data = await apiRequest<{ items: Guest[] }>("/guests");
    setGuests(data.items);
  }

  useEffect(() => {
    loadGuests();
  }, []);

  const filteredGuests = useMemo(
    () => guests.filter((guest) => (filter === "all" ? true : guest.rsvpStatus === filter)),
    [filter, guests],
  );

  async function addGuest() {
    if (!name.trim()) {
      return;
    }
    await apiRequest("/guests", { method: "POST", bodyData: { name, email } });
    setName("");
    setEmail("");
    await loadGuests();
  }

  async function updateStatus(id: string, status: Guest["rsvpStatus"]) {
    await apiRequest(`/guests/${id}`, { method: "PUT", bodyData: { rsvpStatus: status } });
    await loadGuests();
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Guest Summary">
        <p>Total guests: {guests.length}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-muted" type="button" onClick={() => setFilter("all")}>
            All
          </button>
          <button className="btn btn-muted" type="button" onClick={() => setFilter("pending")}>
            Pending
          </button>
          <button className="btn btn-muted" type="button" onClick={() => setFilter("accepted")}>
            Accepted
          </button>
          <button className="btn btn-muted" type="button" onClick={() => setFilter("declined")}>
            Declined
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Add Guest">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Guest name" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email (optional)" />
          <button className="btn btn-primary" type="button" onClick={() => void addGuest()}>
            Add
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Guest List">
        <div style={{ display: "grid", gap: 8 }}>
          {filteredGuests.map((guest) => (
            <GuestRow key={guest._id} guest={guest} onStatusChange={updateStatus} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
