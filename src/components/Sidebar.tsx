import { NavLink } from "react-router-dom";
import ComingSoonBadge from "./ComingSoonBadge";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/checklist", label: "Checklist" },
  { to: "/budget", label: "Budget" },
  { to: "/guests", label: "Guests" },
  { to: "/themes", label: "Themes" },
  { to: "/seating", label: "Seating" },
  { to: "/photos", label: "Photos" },
  { to: "/ai-planner", label: "AI Planner" },
];

export default function Sidebar() {
  return (
    <aside className="glass" style={{ padding: "1rem", minWidth: 220 }}>
      <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>WedGuru</h2>
      <nav style={{ display: "grid", gap: 8 }}>
        {links.map((link) => (
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
            })}
          >
            <span>{link.label}</span>
            {link.to === "/ai-planner" ? <ComingSoonBadge /> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
