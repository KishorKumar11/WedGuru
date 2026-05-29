import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListChecks, DollarSign, Users, Camera, Trash2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";
import type { ActivityLog } from "../lib/types";

const ACTION_ICONS: Record<string, React.ElementType> = {
  added_checklist: ListChecks,
  added_budget: DollarSign,
  added_guest: Users,
  added_photo: Camera,
  deleted: Trash2,
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Activity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiRequest<{ logs: ActivityLog[] }>("/activity")
      .then((d) => setLogs(d.logs))
      .catch(() => setLogs([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section style={{ display: "grid", gap: 14, maxWidth: 640, margin: "0 auto" }}>
      <GlassCard>
        <h1 className="page-title">Activity Feed</h1>
        <p className="muted-label">Last 50 actions across your wedding plan.</p>
      </GlassCard>

      <GlassCard>
        {isLoading ? (
          <p className="muted-label">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="muted-label">No activity yet. Start adding guests, tasks, and expenses!</p>
        ) : (
          <AnimatePresence initial={false}>
            <div style={{ display: "grid", gap: 8 }}>
              {logs.map((log) => {
                const Icon = ACTION_ICONS[log.action] ?? ListChecks;
                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "0.6rem 0.75rem",
                      background: "rgba(255,255,255,0.6)",
                      borderRadius: 10,
                    }}
                  >
                    <Icon size={15} style={{ color: "var(--color-blush)", flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.9rem" }}>{log.detail}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "#aaa", whiteSpace: "nowrap" }}>{timeAgo(log.createdAt)}</span>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </GlassCard>
    </section>
  );
}
