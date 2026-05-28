import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 18, padding: "1rem 0 2rem" }}>
      <Sidebar />
      <main>
        <header className="glass" style={{ marginBottom: 16, padding: "0.8rem 1rem", display: "flex", justifyContent: "space-between" }}>
          <strong>{user?.name}'s Plan</strong>
          <button className="btn btn-muted" onClick={() => void logout()}>Logout</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
