import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, Download, Upload } from "lucide-react";
import GuestRow from "../components/GuestRow";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

const SEAT_TAGS = ["Vegetarian", "Vegan", "Halal", "Gluten-free", "Kids", "Wheelchair", "VIP"];

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [dietary, setDietary] = useState("");
  const [seatTags, setSeatTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Guest["rsvpStatus"] | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadGuests() {
    const data = await apiRequest<{ items: Guest[] }>("/guests");
    setGuests(data.items);
  }

  useEffect(() => {
    loadGuests();
  }, []);

  const filteredGuests = useMemo(
    () =>
      guests.filter((g) => {
        const statusMatch = filter === "all" || g.rsvpStatus === filter;
        const searchMatch = g.name.toLowerCase().includes(search.toLowerCase());
        return statusMatch && searchMatch;
      }),
    [filter, guests, search],
  );

  const summary = useMemo(
    () => ({
      total: guests.length,
      accepted: guests.filter((g) => g.rsvpStatus === "accepted").length,
      declined: guests.filter((g) => g.rsvpStatus === "declined").length,
      pending: guests.filter((g) => g.rsvpStatus === "pending").length,
    }),
    [guests],
  );

  async function addGuest() {
    if (!name.trim()) return;
    await apiRequest("/guests", {
      method: "POST",
      bodyData: {
        name,
        email: email || undefined,
        rsvpDeadline: rsvpDeadline ? `${rsvpDeadline}T00:00:00.000Z` : undefined,
        dietary: dietary || undefined,
        seatTags: seatTags.length ? seatTags : undefined,
      },
    });
    setName("");
    setEmail("");
    setRsvpDeadline("");
    setDietary("");
    setSeatTags([]);
    await loadGuests();
  }

  async function updateStatus(id: string, status: Guest["rsvpStatus"]) {
    await apiRequest(`/guests/${id}`, { method: "PUT", bodyData: { rsvpStatus: status } });
    await loadGuests();
  }

  async function deleteGuest(id: string) {
    await apiRequest(`/guests/${id}`, { method: "DELETE" });
    await loadGuests();
  }

  async function copyInviteLink(token: string, guestId: string) {
    const url = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function exportCsv() {
    const a = document.createElement("a");
    a.href = "/api/guests?format=csv";
    a.download = "wedguru-guests.csv";
    a.click();
  }

  function toggleTag(tag: string) {
    setSeatTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function importCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    const headers = lines[0]?.split(",").map((h) => h.trim().toLowerCase()) ?? [];
    const nameIdx = headers.indexOf("name");
    const emailIdx = headers.indexOf("email");
    if (nameIdx < 0) {
      window.alert("CSV must have a Name column");
      return;
    }
    const rows = lines.slice(1);
    await Promise.all(
      rows.map((row) => {
        const cols = row.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        const guestName = cols[nameIdx];
        if (!guestName) return Promise.resolve();
        const guestEmail = emailIdx >= 0 ? cols[emailIdx] : undefined;
        return apiRequest("/guests", { method: "POST", bodyData: { name: guestName, email: guestEmail || undefined } });
      }),
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
    await loadGuests();
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <GlassCard title="Guest Summary">
        <p>Total: {summary.total} | Accepted: {summary.accepted} | Pending: {summary.pending} | Declined: {summary.declined}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {(["all", "pending", "accepted", "declined"] as const).map((f) => (
            <button
              key={f}
              className={filter === f ? "btn btn-primary" : "btn btn-muted"}
              type="button"
              onClick={() => setFilter(f)}
              style={{ fontSize: "0.85rem" }}
            >
              {f}
            </button>
          ))}
          <button className="btn btn-muted" type="button" onClick={exportCsv} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={14} />
            Export CSV
          </button>
          <label className="btn btn-muted" style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <Upload size={14} />
            Import CSV
            <input ref={fileInputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => void importCsv(e)} />
          </label>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          style={{ marginTop: 8, padding: 8, width: "100%", maxWidth: 320 }}
        />
      </GlassCard>

      <GlassCard title="Add Guest">
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (for invite)" />
            <button className="btn btn-primary" type="button" onClick={() => void addGuest()}>Add</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: "0.82rem", display: "block", marginBottom: 4 }}>RSVP deadline</label>
              <input type="date" value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.82rem", display: "block", marginBottom: 4 }}>Dietary</label>
              <input value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="e.g. Vegetarian" style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", margin: "0 0 6px" }}>Seat tags</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SEAT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={seatTags.includes(tag) ? "btn btn-primary" : "btn btn-muted"}
                  style={{ fontSize: "0.78rem", padding: "3px 10px" }}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Guest List">
        <div style={{ display: "grid", gap: 10 }}>
          {filteredGuests.map((guest) => (
            <article key={guest._id} className="glass" style={{ padding: "0.75rem", display: "grid", gap: 6 }}>
              <GuestRow guest={guest} onStatusChange={updateStatus} />
              {guest.rsvpDeadline ? (
                <p className="muted-label" style={{ margin: 0, fontSize: "0.8rem" }}>
                  RSVP deadline: {new Date(guest.rsvpDeadline).toLocaleDateString()}
                  {new Date(guest.rsvpDeadline) < new Date() && guest.rsvpStatus === "pending" ? (
                    <span style={{ color: "#b42318", marginLeft: 6 }}>⚠ Overdue</span>
                  ) : null}
                </p>
              ) : null}
              {guest.seatTags?.length ? (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {guest.seatTags.map((tag) => (
                    <span key={tag} style={{ fontSize: "0.75rem", background: "rgba(200,149,110,0.15)", padding: "2px 8px", borderRadius: 99 }}>{tag}</span>
                  ))}
                </div>
              ) : null}
              {guest.dietary ? (
                <p className="muted-label" style={{ margin: 0, fontSize: "0.8rem" }}>Dietary: {guest.dietary}</p>
              ) : null}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-muted"
                  type="button"
                  style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4 }}
                  onClick={() => void copyInviteLink(guest.inviteToken, guest._id)}
                >
                  {copiedId === guest._id ? <Check size={12} /> : <Copy size={12} />}
                  {copiedId === guest._id ? "Copied!" : "Copy invite link"}
                </button>
                <button
                  className="btn btn-muted"
                  type="button"
                  style={{ fontSize: "0.8rem" }}
                  onClick={() => void deleteGuest(guest._id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
