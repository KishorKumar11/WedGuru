import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const STEPS = ["Wedding date", "Budget", "Guests"] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [weddingDate, setWeddingDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("20000");
  const [guestCount, setGuestCount] = useState("80");
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    await Promise.all([
      weddingDate
        ? apiRequest("/auth/me", { method: "PUT", bodyData: { weddingDate: `${weddingDate}T00:00:00.000Z` } })
        : Promise.resolve(),
      apiRequest("/wedding", {
        method: "PUT",
        bodyData: {
          budgetTotal: Number(totalBudget) || 20000,
          weddingDate: weddingDate ? `${weddingDate}T00:00:00.000Z` : undefined,
        },
      }),
    ]);
    setSaving(false);
    navigate("/dashboard");
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      void finish();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf6f0 0%, #f5e6f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, display: "grid", gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", margin: "0 0 6px" }}>
            Welcome, {user?.name ?? ""}! 🎉
          </h1>
          <p className="muted-label">Let&apos;s set up your wedding in 3 quick steps.</p>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 99,
                background: i <= step ? "var(--color-blush)" : "rgba(200,149,110,0.2)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="glass"
            style={{ padding: "2rem", display: "grid", gap: 16 }}
          >
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
              Step {step + 1}: {STEPS[step]}
            </h2>

            {step === 0 ? (
              <>
                <p className="muted-label" style={{ margin: 0 }}>When is the big day?</p>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  style={{ padding: "10px 12px", borderRadius: 10, fontSize: "1rem" }}
                />
              </>
            ) : step === 1 ? (
              <>
                <p className="muted-label" style={{ margin: 0 }}>What&apos;s your total budget?</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.2rem" }}>$</span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    style={{ padding: "10px 12px", borderRadius: 10, fontSize: "1rem", flex: 1 }}
                    min="0"
                  />
                </div>
                <p className="muted-label" style={{ margin: 0, fontSize: "0.82rem" }}>
                  You can adjust this anytime in the Budget section.
                </p>
              </>
            ) : (
              <>
                <p className="muted-label" style={{ margin: 0 }}>Roughly how many guests are you expecting?</p>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  style={{ padding: "10px 12px", borderRadius: 10, fontSize: "1rem" }}
                  min="1"
                  max="1000"
                />
                <p className="muted-label" style={{ margin: 0, fontSize: "0.82rem" }}>
                  This helps the AI planner give you better advice.
                </p>
              </>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {step > 0 ? (
                <button className="btn btn-muted" type="button" onClick={() => setStep((s) => s - 1)}>
                  Back
                </button>
              ) : null}
              <button className="btn btn-primary" type="button" onClick={next} disabled={saving} style={{ minWidth: 100 }}>
                {step === STEPS.length - 1 ? (saving ? "Saving…" : "Get started!") : "Next →"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          style={{ background: "none", border: "none", cursor: "pointer", textAlign: "center" }}
          className="muted-label"
          onClick={() => navigate("/dashboard")}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
