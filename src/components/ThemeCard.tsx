import { useState, type CSSProperties } from "react";
import type { ThemeIdea } from "../lib/theme-ideas";
import { themeAccentColor } from "../lib/theme-utils";


export default function ThemeCard({ theme }: { theme: ThemeIdea }) {
  const [imageFailed, setImageFailed] = useState(false);
  const accent = themeAccentColor(theme.palette);
  const fallbackFrom = theme.palette[0] ?? "#f4f2ef";
  const fallbackTo = theme.palette[theme.palette.length - 1] ?? "#9d9489";

  return (
    <article
      className="glass theme-card"
      style={
        {
          "--theme-accent": accent,
          "--theme-fallback-from": fallbackFrom,
          "--theme-fallback-to": fallbackTo,
        } as CSSProperties
      }
    >
      <div className="theme-card__media" aria-hidden={imageFailed}>
        {!imageFailed ? (
          <img
            className="theme-card__image"
            src={theme.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : null}
      </div>
      <div className="theme-card__body">
        <h3 className="theme-card__title">{theme.name}</h3>
        <p className="theme-card__description">{theme.description}</p>
        <div style={{ display: "flex", gap: 6 }} role="list" aria-label={`${theme.name} color palette`}>
          {theme.palette.map((color) => (
            <span
              key={color}
              role="listitem"
              aria-label={`Palette color ${color}`}
              title={color}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: color,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
