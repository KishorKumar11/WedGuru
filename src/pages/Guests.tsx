import { useEffect, useMemo, useState } from "react";
import GuestRow from "../components/GuestRow";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Guest["rsvpStatus"] | "all">("all");

  async function loadGuests() {
    const data = await apiRequest<{ items: Guest[] }>("/guests");
    setGuests(data.items);
  }

  useEffect(() => {
    loadGuests();
  }, []);

  const filteredGuests = useMemo(
    () =>
      guests.filter((guest) => {
        const statusMatch = filter === "all" ? true : guest.rsvpStatus === filter;
        const searchMatch = guest.name.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
      }),
    [filter, guests, search],
  );

  const summary = useMemo(
    () => ({
      total: guests.length,
      accepted: guests.filter((guest) => guest.rsvpStatus === "accepted").length,
      declined: guests.filter((guest) => guest.rsvpStatus === "declined").length,
      pending: guests.filter((guest) => guest.rsvpStatus === "pending").length,
    }),
    [guests],
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

  async function copyInviteLink(token: string) {
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(inviteUrl);
  }

  function exportCsv() {
    const link = document.createElement("a");
    link.href = "/api/guests?format=csv";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.click();
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Guest Summary">
        <p>
          Total: {summary.total} | Accepted: {summary.accepted} | Pending: {summary.pending} | Declined: {summary.declined}
        </p>
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
          <button className="btn btn-muted" type="button" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by guest name"
          style={{ marginTop: 8, padding: 8, width: "100%", maxWidth: 320 }}
        />
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
            <div key={guest._id} style={{ display: "grid", gap: 8 }}>
              <GuestRow guest={guest} onStatusChange={updateStatus} />
              <button className="btn btn-muted" type="button" onClick={() => void copyInviteLink(guest.inviteToken)}>
                Copy invite link
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
