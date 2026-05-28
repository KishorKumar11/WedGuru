import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <section className="glass" style={{ padding: "2.5rem", textAlign: "center" }}>
        <h1 className="page-title" style={{ fontSize: "3rem" }}>Plan your perfect day</h1>
        <p style={{ maxWidth: 580, margin: "0 auto 1.25rem" }}>
          Wedding planning, now calm and beautiful. Checklist, budget, guests, invites, photos in one place.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <Link className="btn btn-primary" to="/register">Get Started</Link>
          <Link className="btn btn-muted" to="/login">Login</Link>
        </div>
      </section>
    </div>
  );
}
