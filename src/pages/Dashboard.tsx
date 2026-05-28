import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import ProgressRing from "../components/ProgressRing";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import type { BudgetItem, ChecklistItem, Guest } from "../lib/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [profileDraft, setProfileDraft] = useState({ partnerName: "", weddingDate: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [venue, setVenue] = useState("");

  useEffect(() => {
    void Promise.all([
      apiRequest<{ items: ChecklistItem[] }>("/checklist").then((data) => setChecklist(data.items)).catch(() => setChecklist([])),
      apiRequest<{ items: BudgetItem[] }>("/budget").then((data) => setBudget(data.items)).catch(() => setBudget([])),
      apiRequest<{ items: Guest[] }>("/guests").then((data) => setGuests(data.items)).catch(() => setGuests([])),
      apiRequest<{ wedding: { weddingDate?: string; venue?: string } }>("/wedding")
        .then((data) => {
          if (data.wedding?.weddingDate) {
            setProfileDraft((prev) => ({ ...prev, weddingDate: data.wedding.weddingDate!.slice(0, 10) }));
          }
          if (data.wedding?.venue) {
            setVenue(data.wedding.venue);
          }
        })
        .catch(() => undefined),
    ]);
  }, []);

  useEffect(() => {
    setProfileDraft({
      partnerName: user?.partnerName ?? "",
      weddingDate: user?.weddingDate ? user.weddingDate.slice(0, 10) : "",
    });
  }, [user?.partnerName, user?.weddingDate]);

  const checklistPercent = useMemo(() => {
    if (!checklist.length) {
      return 0;
    }
    return (checklist.filter((item) => item.isCompleted).length / checklist.length) * 100;
  }, [checklist]);

  const budgetTotals = useMemo(
    () =>
      budget.reduce(
        (acc, item) => ({ estimated: acc.estimated + item.estimated, actual: acc.actual + item.actual }),
        { estimated: 0, actual: 0 },
      ),
    [budget],
  );

  const guestConfirmed = guests.filter((guest) => guest.rsvpStatus === "accepted").length;
  const weddingDate = user?.weddingDate ? new Date(user.weddingDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

  async function saveWeddingProfile() {
    const payload: { partnerName?: string; weddingDate?: string } = {};
    if (profileDraft.partnerName.trim()) {
      payload.partnerName = profileDraft.partnerName.trim();
    }
    if (profileDraft.weddingDate) {
      payload.weddingDate = `${profileDraft.weddingDate}T00:00:00.000Z`;
    }
    await apiRequest("/auth/me", { method: "PUT", bodyData: payload });
    await apiRequest("/wedding", {
      method: "PUT",
      bodyData: {
        weddingDate: payload.weddingDate,
        venue: venue || undefined,
      },
    });
    setProfileMessage("Profile saved. Refresh page to see updated countdown.");
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard>
        <h1 className="page-title">Dashboard</h1>
        <p className="muted-label">Track checklist, budget, guest responses, and your countdown in one calm place.</p>
        <p style={{ marginTop: 8 }}>
          {user?.name} & {user?.partnerName || "Partner"} - {daysLeft} days to wedding
        </p>
        <p className="muted-label">Venue: {venue || "Not set"}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginTop: 10 }}>
          <input
            value={profileDraft.partnerName}
            onChange={(event) => setProfileDraft((prev) => ({ ...prev, partnerName: event.target.value }))}
            placeholder="Partner name"
          />
          <input
            type="date"
            value={profileDraft.weddingDate}
            onChange={(event) => setProfileDraft((prev) => ({ ...prev, weddingDate: event.target.value }))}
          />
          <input value={venue} onChange={(event) => setVenue(event.target.value)} placeholder="Venue" />
          <button className="btn btn-muted" type="button" onClick={() => void saveWeddingProfile()}>
            Save
          </button>
        </div>
        {profileMessage ? <p className="muted-label">{profileMessage}</p> : null}
      </GlassCard>
      <div className="responsive-grid-3">
        <GlassCard title="Checklist progress">
          <ProgressRing value={checklistPercent} />
        </GlassCard>
        <GlassCard title="Budget snapshot">
          <p>Estimated: ${budgetTotals.estimated.toFixed(2)}</p>
          <p>Actual: ${budgetTotals.actual.toFixed(2)}</p>
        </GlassCard>
        <GlassCard title="Guest status">
          <p>
            Confirmed: {guestConfirmed} / {guests.length || 0}
          </p>
        </GlassCard>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link className="btn btn-primary" to="/checklist">
          Add task
        </Link>
        <Link className="btn btn-muted" to="/budget">
          Add expense
        </Link>
        <Link className="btn btn-muted" to="/guests">
          Add guest
        </Link>
        <Link className="btn btn-muted" to="/themes">
          Explore themes
        </Link>
      </div>
    </section>
  );
}
