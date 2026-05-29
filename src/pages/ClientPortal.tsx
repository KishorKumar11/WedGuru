import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Users, Wallet, ListChecks } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { ActivityLog, ChecklistItem } from "../lib/types";

interface ClientStatus {
  couple: { name: string; partnerName?: string; weddingDate?: string };
  guestCounts: { total: number; accepted: number; pending: number };
  budgetTotals: { estimated: number; actual: number };
  pendingTasks: ChecklistItem[];
  recentActivity: ActivityLog[];
}

export default function ClientPortal() {
  const [params] = useSearchParams();
  const coupleId = params.get("coupleId") ?? "";
  const [data, setData] = useState<ClientStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!coupleId) {
      setError("No couple selected.");
      return;
    }
    apiRequest<ClientStatus>(`/planner/client-status?coupleId=${coupleId}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [coupleId]);

  if (error) {
    return (
      <section style={{ display: "grid", gap: 14 }}>
        <GlassCard>
          <p style={{ color: "#b42318" }}>{error}</p>
          <Link className="btn btn-muted" to="/planner">Back to workspace</Link>
        </GlassCard>
      </section>
    );
  }

  if (!data) {
    return <GlassCard><p className="muted-label">Loading…</p></GlassCard>;
  }

  const { couple, guestCounts, budgetTotals, pendingTasks, recentActivity } = data;
  const daysLeft = couple.weddingDate
    ? Math.max(0, Math.ceil((new Date(couple.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 className="page-title">{couple.name} & {couple.partnerName ?? "Partner"}</h1>
            {couple.weddingDate ? (
              <p className="muted-label" style={{ margin: 0 }}>
                {new Date(couple.weddingDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {daysLeft !== null ? ` · ${daysLeft} days to go` : ""}
              </p>
            ) : null}
          </div>
          <Link className="btn btn-muted" to="/planner" style={{ fontSize: "0.85rem" }}>
            ← Back
          </Link>
        </div>
      </GlassCard>

      <div className="responsive-grid-3">
        <GlassCard title="Guests">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={16} />
            <span>{guestCounts.accepted} / {guestCounts.total} confirmed</span>
          </div>
          <p className="muted-label" style={{ marginTop: 4 }}>Pending: {guestCounts.pending}</p>
        </GlassCard>

        <GlassCard title="Budget">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Wallet size={16} />
            <span>${budgetTotals.actual.toFixed(0)} spent</span>
          </div>
          <p className="muted-label" style={{ marginTop: 4 }}>Estimated: ${budgetTotals.estimated.toFixed(0)}</p>
        </GlassCard>

        <GlassCard title="Pending tasks">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ListChecks size={16} />
            <span>{pendingTasks.length} remaining</span>
          </div>
        </GlassCard>
      </div>

      {pendingTasks.length > 0 ? (
        <GlassCard title="Next tasks">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
            {pendingTasks.map((t) => (
              <li key={t._id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
                <ListChecks size={13} style={{ color: "var(--color-blush)", flexShrink: 0 }} />
                {t.title}
                {t.assignee ? <span className="muted-label" style={{ fontSize: "0.78rem" }}>→ {t.assignee}</span> : null}
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}

      {recentActivity.length > 0 ? (
        <GlassCard title="Recent activity">
          <div style={{ display: "grid", gap: 6 }}>
            {recentActivity.map((log) => (
              <div key={log._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <span>{log.detail}</span>
                <span className="muted-label" style={{ fontSize: "0.78rem", whiteSpace: "nowrap", marginLeft: 8 }}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}
    </section>
  );
}
