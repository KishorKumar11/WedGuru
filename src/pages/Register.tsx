import { FormEvent, useState } from "react";
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
    <div className="container" style={{ padding: "3rem 0" }}>
      <form className="glass" style={{ maxWidth: 430, margin: "0 auto", padding: "1.4rem" }} onSubmit={onSubmit}>
        <h1 className="page-title">Create your wedding space</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} placeholder="Password (min 8)" required style={{ width: "100%", marginBottom: 10, padding: 10 }} />
        {error ? <p style={{ color: "#b42318" }}>{error}</p> : null}
        <button className="btn btn-primary" type="submit">Create account</button>
        <p>Have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
