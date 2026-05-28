import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#faf8f5",
        warm: "#f5ede4",
        // Love / rose palette — matches CSS vars
        rose: {
          50:  "#fff5f8",
          100: "#fff1f6",
          200: "#ffdce9",
          300: "#f0a8c8",
          400: "#e89ab8",
          500: "#d67ba0",
          600: "#c86a95",
          700: "#b85c8a",
          800: "#9b4870",
          900: "#7a3458",
        },
        love: {
          50:  "#fdf2f7",
          100: "#fce7f0",
          200: "#f9cfe1",
          300: "#f4a8c7",
          400: "#ec7aaa",
          500: "#de548d",
          600: "#ca3571",
          700: "#6e304f",
          800: "#4f2138",
          900: "#2d1b33",
        },
        // Aliases for component usage
        "love-700": "#6e304f",
        "love-900": "#2d1b33",
      },
      fontFamily: {
        display: ["Newsreader", "Iowan Old Style", "Georgia", "serif"],
        sans: ["DM Sans", "Avenir Next", "Helvetica Neue", "sans-serif"],
      },
      backgroundImage: {
        "love-gradient":   "linear-gradient(135deg, #e89ab8 0%, #d67ba0 40%, #6e304f 100%)",
        "love-gradient-r": "linear-gradient(90deg, #d67ba0, #6e304f)",
        "hero-radial":
          "radial-gradient(ellipse at 60% 0%, #ffdce9 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, #ffe8f1 0%, transparent 45%)",
        "section-alt":
          "linear-gradient(180deg, rgba(255,240,247,0.6) 0%, rgba(250,248,245,0) 100%)",
        "card-love":
          "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(255,240,247,0.75))",
      },
      boxShadow: {
        love:    "0 8px 32px rgba(214,123,160,0.22)",
        "love-lg": "0 20px 48px rgba(110,48,79,0.18)",
        glow:    "0 0 0 3px rgba(214,123,160,0.18)",
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
