import { useMemo, useState } from "react";
import ThemeCard from "../components/ThemeCard";
import { weddingThemeIdeas } from "../lib/theme-ideas";

const filters = ["all", "classic", "boho", "minimalist", "royal", "garden", "beach"] as const;

export default function Themes() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const ideas = useMemo(
    () => weddingThemeIdeas.filter((theme) => (filter === "all" ? true : theme.category === filter)),
    [filter],
  );

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <header className="glass" style={{ padding: "1rem" }}>
        <h1 className="page-title">Wedding Theme Ideas Explorer</h1>
        <p>Explore curated wedding styles, palettes, and visual references.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {filters.map((value) => (
            <button
              key={value}
              className={filter === value ? "btn btn-primary" : "btn btn-muted"}
              onClick={() => setFilter(value)}
              type="button"
              aria-pressed={filter === value}
            >
              {value}
            </button>
          ))}
        </div>
      </header>
      <div className="responsive-grid-3">
        {ideas.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </section>
  );
}
