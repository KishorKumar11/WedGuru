import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function CoplannerInvite() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return (
      <div className="container page-shell" style={{ justifyContent: "flex-start", maxWidth: 480, margin: "2rem auto" }}>
        <div className="glass" style={{ padding: "1.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)" }}>Already logged in</h1>
          <p>You&apos;re already signed in as {user.name}. Log out first to accept a co-planner invite.</p>
          <button className="btn btn-muted" type="button" onClick={() => navigate("/dashboard")}>Go to dashboard</button>
        </div>
      </div>
    );
  }

  async function accept() {
    if (!form.name || !form.email || !form.password) {
      setError("All fields required.");
      return;
    }
    if (!token) {
      setError("Invalid invite link.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/auth/accept-coplanner", {
        method: "POST",
        bodyData: { token, name: form.name, email: form.email, password: form.password },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf6f0 0%, #f5e6f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div className="glass" style={{ padding: "2rem", width: "100%", maxWidth: 440, display: "grid", gap: 16 }}>
        <h1 style={{ fontFamily: "var(--font-display)", margin: 0, fontSize: "1.5rem" }}>
          You&apos;re invited as co-planner
        </h1>
        <p className="muted-label" style={{ margin: 0 }}>
          Create your account to access the shared wedding workspace.
        </p>

        {error ? <p style={{ color: "#b42318", margin: 0 }}>{error}</p> : null}

        <div style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => void accept()}
          disabled={submitting}
          style={{ padding: "0.8rem" }}
        >
          {submitting ? "Joining…" : "Accept invite & create account"}
        </button>
      </div>
    </div>
  );
}
