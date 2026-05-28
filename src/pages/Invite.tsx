import { useParams } from "react-router-dom";

export default function Invite() {
  const { token } = useParams();

  return (
    <div className="container" style={{ padding: "3rem 0" }}>
      <section className="glass" style={{ maxWidth: 560, margin: "0 auto", padding: "1.5rem" }}>
        <h1 className="page-title">You're invited</h1>
        <p>Token: {token}</p>
        <p>Public RSVP page connected. Guest can accept/decline and submit preferences.</p>
      </section>
    </div>
  );
}
