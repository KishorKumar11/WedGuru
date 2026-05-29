import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Invite = lazy(() => import("./pages/Invite"));
const CoplannerInvite = lazy(() => import("./pages/CoplannerInvite"));
const FamilySummary = lazy(() => import("./pages/FamilySummary"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Checklist = lazy(() => import("./pages/Checklist"));
const Budget = lazy(() => import("./pages/Budget"));
const Guests = lazy(() => import("./pages/Guests"));
const Seating = lazy(() => import("./pages/Seating"));
const PhotoWall = lazy(() => import("./pages/PhotoWall"));
const Themes = lazy(() => import("./pages/Themes"));
const AiPlanner = lazy(() => import("./pages/AiPlanner"));
const Vendors = lazy(() => import("./pages/Vendors"));
const Activity = lazy(() => import("./pages/Activity"));
const PartyTasks = lazy(() => import("./pages/PartyTasks"));
const PlannerWorkspace = lazy(() => import("./pages/PlannerWorkspace"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invite/:token" element={<Invite />} />
        <Route path="/coplanner-invite/:token" element={<CoplannerInvite />} />
        <Route path="/family/:token" element={<FamilySummary />} />

        {/* Onboarding (protected but standalone — no sidebar layout) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Protected app routes with sidebar layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/seating" element={<Seating />} />
          <Route path="/photos" element={<PhotoWall />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/ai-planner" element={<AiPlanner />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/party-tasks" element={<PartyTasks />} />
          <Route path="/planner" element={<PlannerWorkspace />} />
          <Route path="/client-portal" element={<ClientPortal />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Suspense>
  );
}
