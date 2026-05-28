import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInsights from "../components/AuthInsights";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="container page-shell">
      <div className="auth-grid">
        <form className="glass" style={{ padding: "1.4rem" }} onSubmit={onSubmit}>
          <span className="feature-chip">Welcome back</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Continue your wedding plan
          </h1>
          <p className="muted-label">Login to access timeline tasks, budget view, guests, and themes.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", margin: "12px 0 10px", padding: 10 }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
          {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit">Login</button>
            <button
              className="btn btn-muted"
              type="button"
              onClick={() => {
                void login("demo@wedguru.app", "WedGuru@123").then(() => navigate("/dashboard")).catch((err: Error) => setError(err.message));
              }}
            >
              Try demo account
            </button>
          </div>
          <p style={{ marginTop: 10 }}>New here? <Link to="/register">Create account</Link></p>
        </form>
        <AuthInsights title="One place for your full wedding journey" />
      </div>
    </div>
  );
}
