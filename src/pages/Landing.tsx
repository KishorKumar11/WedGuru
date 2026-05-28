import { Link } from "react-router-dom";
import ThemeCard from "../components/ThemeCard";
import { weddingThemeIdeas } from "../lib/theme-ideas";

export default function Landing() {
  return (
    <div className="container page-shell" style={{ justifyContent: "flex-start", gap: 18 }}>
      <section className="glass" style={{ padding: "2rem" }}>
        <span className="feature-chip">WedGuru</span>
        <h1 className="page-title" style={{ fontSize: "3rem", marginTop: 12 }}>Your wedding command center</h1>
        <p className="muted-label" style={{ maxWidth: 680 }}>
          Inspired by clean modern SaaS flows, WedGuru gives couples one peaceful place to plan tasks, control spend,
          manage guests, and discover style direction with less stress and more joy.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <Link className="btn btn-primary" to="/register">Start planning free</Link>
          <Link className="btn btn-muted" to="/login">Sign in</Link>
        </div>
      </section>
      <section className="responsive-grid-3">
        <article className="glass" style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Plan with confidence</h3>
          <p className="muted-label">Timeline checklist pre-filled by wedding phase, so you always know next step.</p>
        </article>
        <article className="glass" style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Keep money in control</h3>
          <p className="muted-label">Budget snapshots by category help avoid overspending surprises.</p>
        </article>
        <article className="glass" style={{ padding: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Design your vibe</h3>
          <p className="muted-label">Theme ideas with curated palettes and visual references for easy decisions.</p>
        </article>
      </section>
      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Popular Theme Ideas</h2>
        <div className="responsive-grid-3">
          {weddingThemeIdeas.slice(0, 3).map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </section>
    </div>
  );
}
