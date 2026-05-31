import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="auth-page-full">
      <Link className="auth-page-back-link" to="/">
        ← Back to home
      </Link>
      <div className="auth-layout-card">
        <section className="auth-layout-form-pane auth-fade-up">
          <form className="auth-reference-form" onSubmit={onSubmit}>
            <div className="auth-reference-brand">WedGuru</div>
            <h1 className="auth-reference-title">Create your account</h1>
            <p className="auth-reference-subtitle">
              Set up once. Plan everything with your partner in one calm dashboard.
            </p>

            <label className="auth-reference-label" htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              className="auth-reference-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Emma or Rahul"
              required
            />

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
              minLength={8}
              placeholder="At least 8 characters"
              required
            />

            {error ? <p className="auth-reference-error">{error}</p> : null}

            <button className="auth-reference-submit" type="submit">
              Create account
            </button>

            <p className="auth-reference-footer">
              Have an account? <Link to="/login">Login</Link>
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
            <p className="auth-image-quote-text">
              "Start in minutes. Invite your partner later and plan every detail together."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
