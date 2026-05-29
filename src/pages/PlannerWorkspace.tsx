import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, ExternalLink } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface CoupleRow {
  _id: string;
  name: string;
  partnerName?: string;
  weddingDate?: string;
  email: string;
  guestCount: number;
  totalSpend: number;
  pendingTasks: number;
}

export default function PlannerWorkspace() {
  const { user } = useAuth();
  const [couples, setCouples] = useState<CoupleRow[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "planner-pro") return;
    apiRequest<{ couples: CoupleRow[] }>("/planner/couples")
      .then((d) => setCouples(d.couples))
      .catch(() => setCouples([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  async function inviteCouple() {
    if (!inviteEmail.trim()) return;
    try {
      await apiRequest("/planner/couples", { method: "POST", bodyData: { coupleEmail: inviteEmail } });
      setInviteMessage(`Added ${inviteEmail} to your managed couples.`);
      setInviteEmail("");
      const data = await apiRequest<{ couples: CoupleRow[] }>("/planner/couples");
      setCouples(data.couples);
    } catch (err) {
      setInviteMessage(err instanceof Error ? err.message : "Failed to add couple.");
    }
  }

  if (user?.role !== "planner-pro") {
    return (
      <section style={{ display: "grid", gap: 14 }}>
        <GlassCard>
          <h1 className="page-title">Planner Workspace</h1>
          <p className="muted-label">This area is for Planner Pro accounts only.</p>
          <p>Your current role: <strong>{user?.role ?? "primary"}</strong></p>
        </GlassCard>
      </section>
    );
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard>
        <h1 className="page-title">Planner Workspace</h1>
        <p className="muted-label">Manage all your couples from one place.</p>
      </GlassCard>

      <GlassCard title="Add couple">
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Couple's email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ flex: 1 }}
            onKeyDown={(e) => { if (e.key === "Enter") void inviteCouple(); }}
          />
          <button className="btn btn-primary" type="button" onClick={() => void inviteCouple()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <UserPlus size={14} />
            Add
          </button>
        </div>
        {inviteMessage ? <p className="muted-label" style={{ marginTop: 6 }}>{inviteMessage}</p> : null}
        <p className="muted-label" style={{ marginTop: 6, fontSize: "0.82rem" }}>
          The couple must have a WedGuru account. Enter the email they registered with.
        </p>
      </GlassCard>

      <GlassCard title={`Couples (${couples.length})`}>
        {isLoading ? (
          <p className="muted-label">Loading…</p>
        ) : couples.length === 0 ? (
          <p className="muted-label">No couples yet. Add their email above.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {couples.map((couple) => {
              const daysLeft = couple.weddingDate
                ? Math.max(0, Math.ceil((new Date(couple.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : null;
              return (
                <article
                  key={couple._id}
                  style={{ background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "0.9rem", display: "grid", gap: 6 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <strong>{couple.name} & {couple.partnerName ?? "Partner"}</strong>
                      <p className="muted-label" style={{ margin: "2px 0 0", fontSize: "0.82rem" }}>{couple.email}</p>
                    </div>
                    <Link
                      to={`/client-portal?coupleId=${couple._id}`}
                      className="btn btn-muted"
                      style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <ExternalLink size={12} />
                      View
                    </Link>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", flexWrap: "wrap" }}>
                    {daysLeft !== null ? <span>{daysLeft} days left</span> : null}
                    <span>{couple.guestCount} guests</span>
                    <span>${couple.totalSpend.toFixed(0)} spent</span>
                    <span>{couple.pendingTasks} tasks pending</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
