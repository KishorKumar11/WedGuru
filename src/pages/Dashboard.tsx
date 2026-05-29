import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Users, Wallet, ListChecks, Calendar } from "lucide-react";
import GlassCard from "../components/GlassCard";
import ProgressRing from "../components/ProgressRing";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import type { BudgetItem, ChecklistItem, Guest } from "../lib/types";

const PHASE_MAP: Record<string, string> = {
  "12mo": "12+ months",
  "6mo": "6 months",
  "3mo": "3 months",
  "1mo": "1 month",
  "1wk": "1 week",
  custom: "Custom",
};

function getCurrentPhase(weddingDate: Date): string {
  const monthsLeft = (weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsLeft >= 12) return "12mo";
  if (monthsLeft >= 6) return "6mo";
  if (monthsLeft >= 3) return "3mo";
  if (monthsLeft >= 1) return "1mo";
  return "1wk";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [profileDraft, setProfileDraft] = useState({ partnerName: "", weddingDate: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [venue, setVenue] = useState("");
  const [familyToken, setFamilyToken] = useState<string | null>(null);
  const [copiedFamily, setCopiedFamily] = useState(false);
  const [copiedCoplanner, setCopiedCoplanner] = useState(false);

  useEffect(() => {
    void Promise.all([
      apiRequest<{ items: ChecklistItem[] }>("/checklist").then((d) => setChecklist(d.items)).catch(() => setChecklist([])),
      apiRequest<{ items: BudgetItem[] }>("/budget").then((d) => setBudget(d.items)).catch(() => setBudget([])),
      apiRequest<{ items: Guest[] }>("/guests").then((d) => setGuests(d.items)).catch(() => setGuests([])),
      apiRequest<{ wedding: { weddingDate?: string; venue?: string }; familyToken?: string }>("/wedding")
        .then((d) => {
          if (d.wedding?.weddingDate) {
            setProfileDraft((prev) => ({ ...prev, weddingDate: d.wedding.weddingDate!.slice(0, 10) }));
          }
          if (d.wedding?.venue) setVenue(d.wedding.venue);
          if (d.familyToken) setFamilyToken(d.familyToken);
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
    if (!checklist.length) return 0;
    return (checklist.filter((i) => i.isCompleted).length / checklist.length) * 100;
  }, [checklist]);

  const budgetTotals = useMemo(
    () => budget.reduce((acc, i) => ({ estimated: acc.estimated + i.estimated, actual: acc.actual + i.actual }), { estimated: 0, actual: 0 }),
    [budget],
  );

  const guestConfirmed = guests.filter((g) => g.rsvpStatus === "accepted").length;
  const weddingDate = user?.weddingDate ? new Date(user.weddingDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

  const thisWeekTasks = useMemo(() => {
    if (!checklist.length) return [];
    const phase = getCurrentPhase(weddingDate);
    const phaseItems = checklist.filter((i) => !i.isCompleted && i.monthsBefore === phase);
    return phaseItems.slice(0, 5);
  }, [checklist, weddingDate]);

  async function saveWeddingProfile() {
    const payload: { partnerName?: string; weddingDate?: string } = {};
    if (profileDraft.partnerName.trim()) payload.partnerName = profileDraft.partnerName.trim();
    if (profileDraft.weddingDate) payload.weddingDate = `${profileDraft.weddingDate}T00:00:00.000Z`;
    await Promise.all([
      apiRequest("/auth/me", { method: "PUT", bodyData: payload }),
      apiRequest("/wedding", { method: "PUT", bodyData: { weddingDate: payload.weddingDate, venue: venue || undefined } }),
    ]);
    setProfileMessage("Saved.");
  }

  async function generateFamilyLink() {
    const data = await apiRequest<{ familyToken: string }>("/wedding", {
      method: "PUT",
      bodyData: { generateFamilyToken: true },
    });
    if (data.familyToken) setFamilyToken(data.familyToken);
  }

  async function generateCoplannerInvite() {
    const data = await apiRequest<{ inviteUrl: string }>("/auth/invite-coplanner", { method: "POST" });
    await navigator.clipboard.writeText(data.inviteUrl);
    setCopiedCoplanner(true);
    setTimeout(() => setCopiedCoplanner(false), 2500);
  }

  async function copyFamilyLink() {
    if (!familyToken) {
      await generateFamilyLink();
      return;
    }
    const url = `${window.location.origin}/family/${familyToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedFamily(true);
    setTimeout(() => setCopiedFamily(false), 2500);
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard>
        <h1 className="page-title">Dashboard</h1>
        <p style={{ marginTop: 8 }}>
          {user?.name} & {user?.partnerName || "Partner"} — {daysLeft} days to go
        </p>
        <p className="muted-label">Venue: {venue || "Not set"}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginTop: 10 }}>
          <input
            value={profileDraft.partnerName}
            onChange={(e) => setProfileDraft((prev) => ({ ...prev, partnerName: e.target.value }))}
            placeholder="Partner name"
          />
          <input
            type="date"
            value={profileDraft.weddingDate}
            onChange={(e) => setProfileDraft((prev) => ({ ...prev, weddingDate: e.target.value }))}
          />
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" />
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Wallet size={16} />
            <span>Estimated: ${budgetTotals.estimated.toFixed(0)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ marginLeft: 24 }}>Actual: ${budgetTotals.actual.toFixed(0)}</span>
          </div>
        </GlassCard>
        <GlassCard title="Guests">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={16} />
            <span>Confirmed: {guestConfirmed} / {guests.length}</span>
          </div>
          <p className="muted-label" style={{ marginTop: 4 }}>
            Pending: {guests.filter((g) => g.rsvpStatus === "pending").length}
          </p>
        </GlassCard>
      </div>

      {thisWeekTasks.length > 0 ? (
        <GlassCard title={`Focus now — ${PHASE_MAP[getCurrentPhase(weddingDate)] ?? "upcoming"} tasks`}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Calendar size={16} style={{ color: "var(--color-blush)" }} />
            <span className="muted-label">{daysLeft} days left — top tasks for this phase</span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
            {thisWeekTasks.map((task) => (
              <li key={task._id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ListChecks size={14} style={{ flexShrink: 0, color: "var(--color-blush)" }} />
                <span>{task.title}</span>
                {task.assignee ? (
                  <span className="muted-label" style={{ fontSize: "0.78rem" }}>
                    → {task.assignee}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <Link className="btn btn-muted" to="/checklist" style={{ marginTop: 10, display: "inline-block", fontSize: "0.85rem" }}>
            View all tasks
          </Link>
        </GlassCard>
      ) : null}

      <GlassCard title="Share & collaborate">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="btn btn-muted"
            type="button"
            onClick={() => void generateCoplannerInvite()}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {copiedCoplanner ? <Check size={14} /> : <Copy size={14} />}
            {copiedCoplanner ? "Invite link copied!" : "Invite co-planner"}
          </button>
          <button
            className="btn btn-muted"
            type="button"
            onClick={() => void copyFamilyLink()}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {copiedFamily ? <Check size={14} /> : <Copy size={14} />}
            {copiedFamily ? "Family link copied!" : "Copy family summary link"}
          </button>
        </div>
        <p className="muted-label" style={{ marginTop: 8, fontSize: "0.82rem" }}>
          Co-planner link creates a second account with shared access. Family link is read-only.
        </p>
      </GlassCard>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link className="btn btn-primary" to="/checklist">Add task</Link>
        <Link className="btn btn-muted" to="/budget">Add expense</Link>
        <Link className="btn btn-muted" to="/guests">Add guest</Link>
        <Link className="btn btn-muted" to="/themes">Explore themes</Link>
        <Link className="btn btn-muted" to="/ai-planner">Ask AI planner</Link>
        <Link className="btn btn-muted" to="/party-tasks">Party tasks</Link>
        <Link className="btn btn-muted" to="/activity">Activity feed</Link>
      </div>
    </section>
  );
}
