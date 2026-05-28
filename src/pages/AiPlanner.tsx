import { useState } from "react";
import ComingSoonBadge from "../components/ComingSoonBadge";
import GlassCard from "../components/GlassCard";

export default function AiPlanner() {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [message, setMessage] = useState("");

  function saveNotify() {
    if (!notifyEmail.includes("@")) {
      setMessage("Enter valid email.");
      return;
    }
    setMessage("Thanks. We will notify you.");
    setNotifyEmail("");
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard>
        <h1 className="page-title">AI Planner</h1>
        <ComingSoonBadge />
        <p className="muted-label" style={{ marginTop: 8 }}>
          Smart assistant that prioritizes tasks, budget tradeoffs, and vendor decisions.
        </p>
      </GlassCard>
      <GlassCard title="Preview conversation">
        <div style={{ display: "grid", gap: 8 }}>
          <article className="glass" style={{ padding: "0.7rem" }}>
            You: What should I prioritize 6 months before the wedding?
          </article>
          <article className="glass" style={{ padding: "0.7rem" }}>
            AI: Focus on venue confirmation, catering shortlist, and guest save-the-date timeline.
          </article>
        </div>
      </GlassCard>
      <GlassCard title="Get notified">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={notifyEmail}
            onChange={(event) => setNotifyEmail(event.target.value)}
            placeholder="you@example.com"
            style={{ padding: 9, minWidth: 240 }}
          />
          <button className="btn btn-primary" type="button" onClick={saveNotify}>
            Notify me
          </button>
        </div>
        {message ? <p className="muted-label">{message}</p> : null}
      </GlassCard>
    </section>
  );
}
