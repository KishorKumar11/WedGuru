import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Users, Wallet, ListChecks, Calendar, MapPin, Heart, Sparkles } from "lucide-react";
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
  const guestPending = guests.filter((g) => g.rsvpStatus === "pending").length;
  const weddingDate = user?.weddingDate ? new Date(user.weddingDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  const budgetPercent = budgetTotals.estimated > 0 ? Math.min(100, (budgetTotals.actual / budgetTotals.estimated) * 100) : 0;
  const guestPercent = guests.length > 0 ? (guestConfirmed / guests.length) * 100 : 0;
  const formattedDate = user?.weddingDate
    ? new Date(user.weddingDate).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
    : "Date not set";

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
    <section style={{ display: "grid", gap: 18 }}>
      <div className="app-hero">
        <h1 className="app-hero-title">
          {user?.name || "You"} &amp; {user?.partnerName || "Partner"}
        </h1>
        <p className="app-hero-sub">Your wedding is coming together beautifully.</p>
        <div className="app-hero-meta">
          <span className="app-hero-pill">
            <Heart size={14} fill="currentColor" /> {daysLeft} days to go
          </span>
          <span className="app-hero-pill">
            <Calendar size={14} /> {formattedDate}
          </span>
          <span className="app-hero-pill">
            <MapPin size={14} /> {venue || "Venue not set"}
          </span>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon"><ListChecks size={18} /></span>
            Checklist progress
          </div>
          <div className="stat-card-body">
            <div>
              <div className="stat-value">{Math.round(checklistPercent)}%</div>
              <div className="stat-sub">{checklist.filter((i) => i.isCompleted).length} of {checklist.length} done</div>
            </div>
            <ProgressRing value={checklistPercent} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon"><Wallet size={18} /></span>
            Budget snapshot
          </div>
          <div className="stat-card-body">
            <div>
              <div className="stat-value">${budgetTotals.actual.toFixed(0)}</div>
              <div className="stat-sub">of ${budgetTotals.estimated.toFixed(0)} estimated</div>
            </div>
          </div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${budgetPercent}%` }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-card-icon"><Users size={18} /></span>
            Guest RSVPs
          </div>
          <div className="stat-card-body">
            <div>
              <div className="stat-value">{guestConfirmed}<span style={{ fontSize: "1rem", color: "#8a6d7b" }}> / {guests.length}</span></div>
              <div className="stat-sub">{guestPending} awaiting reply</div>
            </div>
          </div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${guestPercent}%` }} />
          </div>
        </div>
      </div>

      {thisWeekTasks.length > 0 ? (
        <div className="surface-card">
          <h2 className="surface-card-title">
            <Calendar size={18} /> Focus now — {PHASE_MAP[getCurrentPhase(weddingDate)] ?? "upcoming"} tasks
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {thisWeekTasks.map((task) => (
              <li
                key={task._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0.7rem 0.85rem",
                  borderRadius: 12,
                  background: "rgba(214,123,160,0.08)",
                }}
              >
                <ListChecks size={16} style={{ flexShrink: 0, color: "var(--love-700)" }} />
                <span style={{ fontWeight: 500 }}>{task.title}</span>
                {task.assignee ? (
                  <span className="feature-chip" style={{ marginLeft: "auto" }}>{task.assignee}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <Link className="btn btn-muted" to="/checklist" style={{ marginTop: 14 }}>
            View all tasks
          </Link>
        </div>
      ) : null}

      <div className="surface-card">
        <h2 className="surface-card-title"><Sparkles size={18} /> Wedding details</h2>
        <div className="dashboard-profile-grid">
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted-label" style={{ fontSize: "0.82rem" }}>Partner name</span>
            <input
              value={profileDraft.partnerName}
              onChange={(e) => setProfileDraft((prev) => ({ ...prev, partnerName: e.target.value }))}
              placeholder="Partner name"
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted-label" style={{ fontSize: "0.82rem" }}>Wedding date</span>
            <input
              type="date"
              value={profileDraft.weddingDate}
              onChange={(e) => setProfileDraft((prev) => ({ ...prev, weddingDate: e.target.value }))}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span className="muted-label" style={{ fontSize: "0.82rem" }}>Venue</span>
            <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" />
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <button className="btn btn-primary" type="button" onClick={() => void saveWeddingProfile()}>
            Save details
          </button>
          {profileMessage ? <span className="muted-label">{profileMessage}</span> : null}
        </div>
      </div>

      <div className="surface-card">
        <h2 className="surface-card-title"><Users size={18} /> Share &amp; collaborate</h2>
        <div className="quick-actions">
          <button className="btn btn-muted" type="button" onClick={() => void generateCoplannerInvite()}>
            {copiedCoplanner ? <Check size={15} /> : <Copy size={15} />}
            {copiedCoplanner ? "Invite link copied!" : "Invite co-planner"}
          </button>
          <button className="btn btn-muted" type="button" onClick={() => void copyFamilyLink()}>
            {copiedFamily ? <Check size={15} /> : <Copy size={15} />}
            {copiedFamily ? "Family link copied!" : "Copy family summary link"}
          </button>
        </div>
        <p className="muted-label" style={{ marginTop: 10, fontSize: "0.82rem" }}>
          Co-planner link creates a second account with shared access. Family link is read-only.
        </p>
      </div>

      <div className="surface-card">
        <h2 className="surface-card-title"><Sparkles size={18} /> Quick actions</h2>
        <div className="quick-actions">
          <Link className="btn btn-primary" to="/checklist">Add task</Link>
          <Link className="btn btn-muted" to="/budget">Add expense</Link>
          <Link className="btn btn-muted" to="/guests">Add guest</Link>
          <Link className="btn btn-muted" to="/themes">Explore themes</Link>
          <Link className="btn btn-muted" to="/ai-planner">Ask AI planner</Link>
          <Link className="btn btn-muted" to="/party-tasks">Party tasks</Link>
          <Link className="btn btn-muted" to="/activity">Activity feed</Link>
        </div>
      </div>
    </section>
  );
}
