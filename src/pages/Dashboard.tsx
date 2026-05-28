import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <section className="glass" style={{ padding: "1rem" }}>
      <h1 className="page-title">Dashboard</h1>
      <p>Track checklist, budget, guest responses, and your countdown in one calm place.</p>
      <div style={{ marginTop: 12 }}>
        <Link className="btn btn-primary" to="/themes">
          Explore wedding themes
        </Link>
      </div>
    </section>
  );
}
