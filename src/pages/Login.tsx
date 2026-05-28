import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <form className="glass" style={{ maxWidth: 430, margin: "0 auto", padding: "1.4rem" }} onSubmit={onSubmit}>
        <h1 className="page-title">Welcome back</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
        {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
        <button className="btn btn-primary" type="submit">Login</button>
        <p>New here? <Link to="/register">Create account</Link></p>
      </form>
    </div>
  );
}
