import { NavLink } from "react-router-dom";
import {
  Activity,
  Armchair,
  Briefcase,
  Camera,
  Heart,
  LayoutDashboard,
  ListChecks,
  PartyPopper,
  Sparkles,
  Users,
  Wallet,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type NavItem = { to: string; label: string; icon: LucideIcon };

const CORE_LINKS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/checklist", label: "Checklist", icon: ListChecks },
  { to: "/budget", label: "Budget", icon: Wallet },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/seating", label: "Seating", icon: Armchair },
  { to: "/themes", label: "Themes", icon: Palette },
  { to: "/photos", label: "Photos", icon: Camera },
  { to: "/party-tasks", label: "Party Tasks", icon: PartyPopper },
  { to: "/ai-planner", label: "AI Planner", icon: Sparkles },
  { to: "/activity", label: "Activity", icon: Activity },
];

export default function Sidebar({ open = false, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
  const { user } = useAuth();

  return (
    <aside className={`app-sidebar${open ? " open" : ""}`}>
      <div className="app-brand">
        <span className="app-brand-mark">
          <Heart size={20} fill="currentColor" />
        </span>
        <span>
          <span className="app-brand-name">WedGuru</span>
          <span className="app-brand-tag">Wedding planner</span>
        </span>
      </div>

      <nav className="app-nav">
        <span className="app-nav-label">Plan</span>
        {CORE_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => `app-nav-link${isActive ? " active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        {user?.role === "planner-pro" ? (
          <>
            <hr className="app-sidebar-divider" />
            <span className="app-nav-label">Pro</span>
            <NavLink
              to="/planner"
              onClick={onNavigate}
              className={({ isActive }) => `app-nav-link${isActive ? " active" : ""}`}
            >
              <Briefcase size={18} />
              <span>Planner Workspace</span>
            </NavLink>
          </>
        ) : null}
      </nav>
    </aside>
  );
}
