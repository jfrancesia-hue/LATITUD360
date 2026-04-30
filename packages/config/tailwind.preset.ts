import type { Config } from "tailwindcss";

/**
 * Latitud360 — Tailwind preset compartido.
 * Mantiene paleta y tipografía consistentes con la landing master.
 */
const preset = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Instrument Serif'", "serif"],
        body: ["'Barlow'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // Brand
        mina: "#0A0A0A",
        acero: "#1F1F1F",
        niebla: "#2A2A2A",
        artico: "#F5F5F5",
        // Productos
        naranja: { DEFAULT: "#FF6B1A", 50: "#FFF1E8", 500: "#FF6B1A", 600: "#E85B0A" },
        turquesa: { DEFAULT: "#00C2B8", 50: "#E5FBF9", 500: "#00C2B8", 600: "#00A8A0" },
        dorado: { DEFAULT: "#D4AF37", 50: "#FBF6E6", 500: "#D4AF37", 600: "#B8961E" },
        violeta: { DEFAULT: "#A78BFA", 500: "#A78BFA" },
        // Sistema
        ok: "#00B86B",
        warn: "#FFC93C",
        alerta: "#E63946",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        pill: "9999px",
      },
      boxShadow: {
        glass: "inset 0 1px 1px rgba(255,255,255,0.10)",
        "glass-strong": "4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15)",
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default preset;
