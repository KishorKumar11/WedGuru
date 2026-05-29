import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CORE_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/checklist", label: "Checklist" },
  { to: "/budget", label: "Budget" },
  { to: "/guests", label: "Guests" },
  { to: "/seating", label: "Seating" },
  { to: "/themes", label: "Themes" },
  { to: "/photos", label: "Photos" },
  { to: "/party-tasks", label: "Party Tasks" },
  { to: "/ai-planner", label: "AI Planner" },
  { to: "/activity", label: "Activity" },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="glass" style={{ padding: "1rem", minWidth: 220 }}>
      <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>WedGuru</h2>
      <nav style={{ display: "grid", gap: 6 }}>
        {CORE_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              background: isActive ? "rgba(200,149,110,0.2)" : "transparent",
              borderRadius: 10,
              padding: "0.55rem 0.7rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              fontSize: "0.93rem",
            })}
          >
            <span>{link.label}</span>
          </NavLink>
        ))}

        {user?.role === "planner-pro" ? (
          <>
            <hr style={{ border: "none", borderTop: "1px solid rgba(200,149,110,0.2)", margin: "4px 0" }} />
            <NavLink
              to="/planner"
              style={({ isActive }) => ({
                background: isActive ? "rgba(200,149,110,0.2)" : "transparent",
                borderRadius: 10,
                padding: "0.55rem 0.7rem",
                display: "flex",
                textDecoration: "none",
                color: "inherit",
                fontSize: "0.93rem",
              })}
            >
              Planner Workspace
            </NavLink>
          </>
        ) : null}
      </nav>
    </aside>
  );
}
