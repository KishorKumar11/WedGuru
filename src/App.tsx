import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Invite = lazy(() => import("./pages/Invite"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Checklist = lazy(() => import("./pages/Checklist"));
const Budget = lazy(() => import("./pages/Budget"));
const Guests = lazy(() => import("./pages/Guests"));
const Seating = lazy(() => import("./pages/Seating"));
const PhotoWall = lazy(() => import("./pages/PhotoWall"));
const Themes = lazy(() => import("./pages/Themes"));
const AiPlanner = lazy(() => import("./pages/AiPlanner"));

export default function App() {
  return (
    <Suspense fallback={<div className="container page-shell">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invite/:token" element={<Invite />} />
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
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Suspense>
  );
}
