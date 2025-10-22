import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // ← Necesario para tu modo oscuro
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
