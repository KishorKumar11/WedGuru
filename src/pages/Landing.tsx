import { Link } from "react-router-dom";
import ThemeCard from "../components/ThemeCard";
import { weddingThemeIdeas } from "../lib/theme-ideas";

export default function Landing() {
  return (
    <div className="container auth-shell" style={{ padding: "3rem 0" }}>
      <section className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
        <h1 className="page-title" style={{ fontSize: "3rem" }}>Plan your perfect day</h1>
        <p style={{ maxWidth: 580, margin: "0 auto 1.25rem" }}>
          Wedding planning, now calm and beautiful. Checklist, budget, guests, invites, photos in one place.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/register">Get Started</Link>
          <Link className="btn btn-muted" to="/login">Login</Link>
          <Link className="btn btn-muted" to="/themes">Explore Themes</Link>
        </div>
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
