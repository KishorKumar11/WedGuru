import type { ThemeIdea } from "../lib/theme-ideas";

export default function ThemeCard({ theme }: { theme: ThemeIdea }) {
  return (
    <article className="glass" style={{ overflow: "hidden" }}>
      <img
        src={theme.imageUrl}
        alt={`${theme.name} wedding inspiration`}
        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
        loading="lazy"
      />
      <div style={{ padding: "0.9rem" }}>
        <h3 style={{ margin: "0 0 0.4rem", fontFamily: "var(--font-display)" }}>{theme.name}</h3>
        <p style={{ margin: "0 0 0.6rem" }}>{theme.description}</p>
        <div style={{ display: "flex", gap: 6 }}>
          {theme.palette.map((color) => (
            <span
              key={color}
              aria-label={`Palette color ${color}`}
              title={color}
              style={{ width: 22, height: 22, borderRadius: 999, background: color, border: "1px solid rgba(0,0,0,0.08)" }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
