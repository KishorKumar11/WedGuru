import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#faf8f5",
        rose: "#c8956e",
        "rose-light": "rgba(200, 149, 110, 0.1)",
        plum: "#2d1b33",
        "plum-light": "#4a3352",
        sage: "#7a9e7e",
        "sage-light": "rgba(122, 158, 126, 0.1)",
        warm: "#f5ede4",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
