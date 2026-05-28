export default function InviteCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section
      className="glass"
      style={{
        maxWidth: 580,
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
        background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(245,237,228,0.95))",
      }}
    >
      <h1 className="page-title" style={{ marginBottom: 10 }}>
        {title}
      </h1>
      <p>{subtitle}</p>
    </section>
  );
}
