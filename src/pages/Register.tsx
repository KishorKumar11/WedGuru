import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInsights from "../components/AuthInsights";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="container page-shell">
      <div className="auth-grid">
        <form className="glass" style={{ padding: "1.4rem" }} onSubmit={onSubmit}>
          <span className="feature-chip">Start in 60 seconds</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            Create your wedding workspace
          </h1>
          <p className="muted-label">Set up once. Plan everything with your partner in one serene dashboard.</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={{ width: "100%", margin: "12px 0 10px", padding: 10 }} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} placeholder="Password (min 8)" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
          {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
          <button className="btn btn-primary" type="submit">Create account</button>
          <p style={{ marginTop: 10 }}>Have account? <Link to="/login">Login</Link></p>
        </form>
        <AuthInsights title="See your next best planning step every day" />
      </div>
    </div>
  );
}
