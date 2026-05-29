import { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import ThemeCard from "../components/ThemeCard";
import GlassCard from "../components/GlassCard";
import { weddingThemeIdeas } from "../lib/theme-ideas";
import { getThemeSuggestions } from "../lib/theme-suggestions";
import { apiRequest } from "../lib/api";

const filters = ["all", "classic", "boho", "minimalist", "royal", "garden", "beach"] as const;

export default function Themes() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  const ideas = useMemo(
    () => weddingThemeIdeas.filter((t) => (filter === "all" ? true : t.category === filter)),
    [filter],
  );

  async function applyTheme(category: string) {
    const suggestions = getThemeSuggestions(category);
    if (!suggestions) return;
    setApplying(category);
    try {
      await Promise.all([
        ...suggestions.checklistTasks.map((task) =>
          apiRequest("/checklist", { method: "POST", bodyData: task }),
        ),
        ...suggestions.budgetCategories.map((item) =>
          apiRequest("/budget", { method: "POST", bodyData: item }),
        ),
      ]);
      setApplied((prev) => new Set([...prev, category]));
    } finally {
      setApplying(null);
    }
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <header className="glass" style={{ padding: "1rem" }}>
        <h1 className="page-title">Wedding Theme Ideas</h1>
        <p>Explore curated styles and apply them to your checklist + budget in one click.</p>
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
          <div key={theme.id} style={{ display: "grid", gap: 8 }}>
            <ThemeCard theme={theme} />
            {getThemeSuggestions(theme.category) ? (
              <GlassCard>
                <div className="theme-apply-row">
                  <span className="theme-apply-label">
                    Apply {theme.category} tasks + budget
                  </span>
                  <button
                    className={`${applied.has(theme.category) ? "btn btn-muted" : "btn btn-primary"} btn-compact`}
                    type="button"
                    disabled={applying === theme.category || applied.has(theme.category)}
                    onClick={() => void applyTheme(theme.category)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                  >
                    {applied.has(theme.category) ? (
                      <><Check size={12} /> Applied</>
                    ) : applying === theme.category ? (
                      "Applying…"
                    ) : (
                      <><Sparkles size={12} /> Apply to plan</>
                    )}
                  </button>
                </div>
              </GlassCard>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
