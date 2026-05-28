import type { ReactNode } from "react";

export default function GlassCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="glass" style={{ padding: "1rem" }}>
      {title ? <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)" }}>{title}</h2> : null}
      {children}
    </section>
  );
}
