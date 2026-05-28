import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InviteCard from "../components/InviteCard";
import { apiRequest } from "../lib/api";
import type { Guest } from "../lib/types";

export default function Invite() {
  const { token } = useParams();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [status, setStatus] = useState<Guest["rsvpStatus"]>("pending");
  const [songRequest, setSongRequest] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    apiRequest<{ guest: Guest }>(`/invite/${token}`).then((data) => {
      setGuest(data.guest);
      setStatus(data.guest.rsvpStatus);
    });
  }, [token]);

  async function submitRsvp() {
    if (!token) {
      return;
    }
    await apiRequest(`/invite/${token}`, { method: "PUT", bodyData: { rsvpStatus: status, songRequest } });
    setMessage("Thank you. RSVP saved.");
  }

  return (
    <div className="container page-shell" style={{ justifyContent: "flex-start" }}>
      <InviteCard title="You're Invited" subtitle="Please confirm your RSVP and any preferences." />
      <section className="glass" style={{ maxWidth: 580, margin: "1rem auto 0", padding: "1.25rem" }}>
        <p>Guest: {guest?.name ?? "Loading..."}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button className="btn btn-muted" onClick={() => setStatus("accepted")} type="button">
            Accept
          </button>
          <button className="btn btn-muted" onClick={() => setStatus("declined")} type="button">
            Decline
          </button>
        </div>
        <input
          value={songRequest}
          onChange={(event) => setSongRequest(event.target.value)}
          placeholder="Song request"
          style={{ width: "100%", marginTop: 10, padding: 10 }}
        />
        <button className="btn btn-primary" type="button" onClick={() => void submitRsvp()}>
          Submit RSVP
        </button>
        {message ? <p>{message}</p> : null}
      </section>
    </div>
  );
}
