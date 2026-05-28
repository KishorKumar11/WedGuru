export default function AuthInsights({ title }: { title: string }) {
  return (
    <aside className="glass" style={{ padding: "1.4rem" }}>
      <span className="feature-chip">Built for calm planning</span>
      <h2 className="page-title" style={{ marginTop: 10 }}>
        {title}
      </h2>
      <p className="muted-label" style={{ marginBottom: 14 }}>
        Replace scattered docs and chats with one peaceful workspace for your whole wedding journey.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <article>
          <strong>Smart Timeline</strong>
          <p className="muted-label">Preloaded checklist by month. See what to do next without stress.</p>
        </article>
        <article>
          <strong>Budget Clarity</strong>
          <p className="muted-label">Track estimated vs actual spend and stay aligned with your plan.</p>
        </article>
        <article>
          <strong>Guest + RSVP Hub</strong>
          <p className="muted-label">Manage guests, share invite links, and monitor responses in real time.</p>
        </article>
        <article>
          <strong>Theme Inspiration</strong>
          <p className="muted-label">Explore curated wedding styles with color palettes and visual references.</p>
        </article>
      </div>
    </aside>
  );
}
