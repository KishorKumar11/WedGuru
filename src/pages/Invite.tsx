import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import InviteCard from "../components/InviteCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

interface WeddingInfo {
  weddingDate?: string;
  venue?: string;
}

function buildGoogleCalendarUrl(weddingDate: string, venue?: string): string {
  const date = new Date(weddingDate);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end = new Date(date.getTime() + 6 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Wedding Day",
    dates: `${fmt(date)}/${fmt(end)}`,
    details: "You are invited! RSVP via WedGuru.",
    location: venue ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function deadlineCountdown(deadline: string): string {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "RSVP deadline has passed";
  if (days === 0) return "RSVP deadline is today!";
  return `RSVP deadline: ${days} day${days === 1 ? "" : "s"} left`;
}

export default function Invite() {
  const { token } = useParams();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo>({});
  const [status, setStatus] = useState<Guest["rsvpStatus"]>("pending");
  const [dietary, setDietary] = useState("none");
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [songRequest, setSongRequest] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiRequest<{ guest: Guest; wedding?: WeddingInfo }>(`/invite/${token}`).then((data) => {
      setGuest(data.guest);
      setStatus(data.guest.rsvpStatus);
      if (data.wedding) setWeddingInfo(data.wedding);
    });
  }, [token]);

  async function submitRsvp() {
    if (!token) return;
    setSubmitting(true);
    await apiRequest(`/invite/${token}`, {
      method: "PUT",
      bodyData: { rsvpStatus: status, dietary, plusOne, plusOneName: plusOne ? plusOneName : "", songRequest },
    });
    setMessage(status === "accepted" ? "You're confirmed! See you there 🎉" : "RSVP saved. Thank you for letting us know.");
    setSubmitting(false);
  }

  const deadlineMsg = guest?.rsvpDeadline ? deadlineCountdown(guest.rsvpDeadline) : null;
  const deadlineIsUrgent = guest?.rsvpDeadline && new Date(guest.rsvpDeadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf6f0 0%, #f5e6f0 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 540, display: "grid", gap: 16 }}>
        <InviteCard title="You're Invited" subtitle="Please confirm your attendance and let us know your preferences." />

        {deadlineMsg ? (
          <div
            style={{
              background: deadlineIsUrgent ? "rgba(180,35,24,0.08)" : "rgba(200,149,110,0.1)",
              border: `1px solid ${deadlineIsUrgent ? "#b42318" : "rgba(200,149,110,0.3)"}`,
              borderRadius: 12,
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Clock size={16} style={{ color: deadlineIsUrgent ? "#b42318" : "var(--color-blush)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.9rem", color: deadlineIsUrgent ? "#b42318" : "inherit", fontWeight: deadlineIsUrgent ? 700 : 400 }}>
              {deadlineMsg}
            </span>
          </div>
        ) : null}

        {weddingInfo.weddingDate ? (
          <div className="glass" style={{ padding: "0.9rem 1rem", display: "grid", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={16} style={{ color: "var(--color-blush)" }} />
              <span>{new Date(weddingInfo.weddingDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            {weddingInfo.venue ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={16} style={{ color: "var(--color-blush)" }} />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(weddingInfo.venue)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit" }}
                >
                  {weddingInfo.venue}
                </a>
              </div>
            ) : null}
            <a
              href={buildGoogleCalendarUrl(weddingInfo.weddingDate, weddingInfo.venue)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-muted"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", width: "fit-content" }}
            >
              <Calendar size={13} />
              Add to Google Calendar
            </a>
          </div>
        ) : null}

        {message ? (
          <div
            style={{
              background: "rgba(2,122,72,0.08)",
              border: "1px solid rgba(2,122,72,0.3)",
              borderRadius: 12,
              padding: "1rem",
              textAlign: "center",
              fontSize: "1rem",
            }}
          >
            {message}
          </div>
        ) : (
          <section className="glass" style={{ padding: "1.25rem", display: "grid", gap: 14 }}>
            <p style={{ margin: 0 }}>
              Hi <strong>{guest?.name ?? "…"}</strong>! Please confirm your attendance:
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className={`btn ${status === "accepted" ? "btn-primary" : "btn-muted"}`}
                onClick={() => setStatus("accepted")}
                type="button"
                style={{ flex: 1 }}
              >
                ✓ Accept
              </button>
              <button
                className={`btn ${status === "declined" ? "btn-primary" : "btn-muted"}`}
                onClick={() => setStatus("declined")}
                type="button"
                style={{ flex: 1 }}
              >
                ✗ Decline
              </button>
            </div>

            {status === "accepted" ? (
              <>
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 4 }}>Dietary requirements</label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8 }}
                  >
                    {["none", "Vegetarian", "Vegan", "Halal", "Gluten-free", "Kosher", "Other"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={plusOne} onChange={(e) => setPlusOne(e.target.checked)} />
                  <span>Bringing a plus one?</span>
                </label>

                {plusOne ? (
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 4 }}>Plus one name</label>
                    <input
                      value={plusOneName}
                      onChange={(e) => setPlusOneName(e.target.value)}
                      placeholder="Full name"
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 8 }}
                    />
                  </div>
                ) : null}

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 4 }}>Song request 🎵</label>
                  <input
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="Any song you'd love to hear?"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 8 }}
                  />
                </div>
              </>
            ) : null}

            <button
              className="btn btn-primary"
              type="button"
              onClick={() => void submitRsvp()}
              disabled={submitting}
              style={{ padding: "0.8rem", fontSize: "1rem" }}
            >
              {submitting ? "Saving…" : "Submit RSVP"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
