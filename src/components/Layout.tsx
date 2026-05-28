import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="container layout-shell auth-shell">
      <Sidebar />
      <main style={{ minWidth: 0 }}>
        <header className="glass" style={{ marginBottom: 16, padding: "0.8rem 1rem", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <strong>{user?.name}'s Plan</strong>
          <button className="btn btn-muted" onClick={() => void logout()}>Logout</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
