import type { Guest } from "../lib/types";

export default function GuestRow({
  guest,
  onStatusChange,
}: {
  guest: Guest;
  onStatusChange: (id: string, status: Guest["rsvpStatus"]) => void;
}) {
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 0.6fr 1fr",
        gap: 10,
        alignItems: "center",
        background: "white",
        borderRadius: 12,
        padding: "0.75rem",
      }}
    >
      <div>
        <strong>{guest.name}</strong>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{guest.email ?? "No email"}</div>
      </div>
      <span>{guest.rsvpStatus}</span>
      <select value={guest.rsvpStatus} onChange={(event) => onStatusChange(guest._id, event.target.value as Guest["rsvpStatus"])}>
        <option value="pending">pending</option>
        <option value="accepted">accepted</option>
        <option value="declined">declined</option>
      </select>
    </article>
  );
}
