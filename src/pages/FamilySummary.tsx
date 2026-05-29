import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, Wallet, Calendar } from "lucide-react";
import { apiRequest } from "../lib/api";

interface FamilyData {
  couple: { name: string; partnerName?: string; weddingDate?: string };
  budget: { estimated: number; actual: number };
  guests: { total: number; accepted: number; declined: number; pending: number };
}

export default function FamilySummary() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<FamilyData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    apiRequest<FamilyData>(`/family/${token}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"));
  }, [token]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#b42318" }}>Summary not found. The link may be expired.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="muted-label">Loading…</p>
      </div>
    );
  }

  const { couple, budget, guests } = data;
  const daysLeft = couple.weddingDate
    ? Math.max(0, Math.ceil((new Date(couple.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf6f0 0%, #f5e6f0 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, display: "grid", gap: 14 }}>
        <div className="glass" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", margin: "0 0 4px" }}>
            {couple.name} & {couple.partnerName ?? "Partner"}
          </h1>
          {couple.weddingDate ? (
            <p className="muted-label" style={{ margin: 0 }}>
              {new Date(couple.weddingDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          ) : null}
          {daysLeft !== null ? (
            <p style={{ margin: "8px 0 0", fontWeight: 700, color: "var(--color-blush)", fontSize: "1.1rem" }}>
              {daysLeft} days to go ✨
            </p>
          ) : null}
        </div>

        <div className="glass" style={{ padding: "1.25rem", display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Calendar size={18} style={{ color: "var(--color-blush)" }} />
            <strong>Timeline</strong>
          </div>
          {daysLeft !== null ? (
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: "var(--color-blush)" }}>{daysLeft}</p>
              <p style={{ margin: 0, fontSize: "0.85rem" }}>days until the wedding</p>
            </div>
          ) : null}
        </div>

        <div className="glass" style={{ padding: "1.25rem", display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Users size={18} style={{ color: "var(--color-blush)" }} />
            <strong>Guests</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Total", value: guests.total, color: "#333" },
              { label: "Confirmed", value: guests.accepted, color: "#027a48" },
              { label: "Pending", value: guests.pending, color: "#b54708" },
              { label: "Declined", value: guests.declined, color: "#b42318" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color }}>{value}</p>
                <p style={{ margin: 0, fontSize: "0.78rem" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: "1.25rem", display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Wallet size={18} style={{ color: "var(--color-blush)" }} />
            <strong>Budget overview</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Estimated", value: budget.estimated },
              { label: "Actual spent", value: budget.actual },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>${value.toFixed(0)}</p>
                <p style={{ margin: 0, fontSize: "0.78rem" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="muted-label" style={{ textAlign: "center", fontSize: "0.78rem" }}>
          Read-only summary · Powered by WedGuru
        </p>
      </div>
    </div>
  );
}
