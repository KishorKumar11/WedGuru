import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/checklist": "Checklist",
  "/budget": "Budget",
  "/guests": "Guests",
  "/seating": "Seating",
  "/themes": "Themes",
  "/photos": "Photo Wall",
  "/party-tasks": "Party Tasks",
  "/ai-planner": "AI Planner",
  "/activity": "Activity",
  "/planner": "Planner Workspace",
};

function initials(name?: string): string {
  if (!name) return "W";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const daysLeft = useMemo(() => {
    if (!user?.weddingDate) return null;
    const diff = new Date(user.weddingDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }, [user?.weddingDate]);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Your Plan";

  return (
    <div className="app-shell">
      <Sidebar open={drawerOpen} onNavigate={() => setDrawerOpen(false)} />
      <div className={`app-scrim${drawerOpen ? " show" : ""}`} onClick={() => setDrawerOpen(false)} />

      <div className="app-main">
        <header className="app-topbar">
          <button
            className="app-icon-btn app-hamburger"
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen((prev) => !prev)}
          >
            <Menu size={20} />
          </button>

          <span className="app-avatar" aria-hidden="true">
            {initials(user?.name)}
          </span>

          <div className="app-topbar-greeting">
            <span className="app-topbar-hello">Welcome back</span>
            <span className="app-topbar-title">{pageTitle}</span>
          </div>

          <div className="app-topbar-spacer" />

          {daysLeft !== null ? (
            <span className="app-countdown-chip">
              <span className="app-countdown-num">{daysLeft}</span>
              days to go
            </span>
          ) : null}

          <button className="btn btn-muted" type="button" onClick={() => void logout()}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </header>

        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
