import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AiPlanner from "./pages/AiPlanner";
import Budget from "./pages/Budget";
import Checklist from "./pages/Checklist";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import Invite from "./pages/Invite";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PhotoWall from "./pages/PhotoWall";
import Register from "./pages/Register";
import Seating from "./pages/Seating";

export default function App() {
  return (
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
        <Route path="/ai-planner" element={<AiPlanner />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
