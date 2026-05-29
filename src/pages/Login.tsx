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
    <div className="auth-page-full">
      <Link className="auth-page-back-link" to="/">
        ← Back to home
      </Link>
      <div className="auth-layout-card">
        <section className="auth-layout-form-pane auth-fade-up">
          <form className="auth-reference-form" onSubmit={onSubmit}>
            <div className="auth-reference-brand">WedGuru</div>
            <h1 className="auth-reference-title">Welcome back</h1>
            <p className="auth-reference-subtitle">Login to continue your wedding planning journey.</p>

            <label className="auth-reference-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="auth-reference-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />

            <label className="auth-reference-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="auth-reference-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Your password"
              required
            />

            {error ? <p className="auth-reference-error">{error}</p> : null}

            <button className="auth-reference-submit" type="submit">
              Login
            </button>

            <p className="auth-reference-footer">
              New here? <Link to="/register">Create account</Link>
            </p>
          </form>
        </section>

        <section className="auth-layout-image-pane">
          <img
            className="auth-layout-image"
            src="/auth-couple-login.png"
            alt="Couple standing on beach during sunset"
          />
          <div className="auth-image-quote auth-fade-in">
            <p className="auth-image-quote-text">"Plan together, stay on budget, and turn every wedding task into a calm, shared journey."</p>
          </div>
        </section>
      </div>
    </div>
  );
}
