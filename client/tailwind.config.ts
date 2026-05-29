import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blood: {
          500: "#d11717",
          600: "#a80f13",
          700: "#73070b"
        },
        terminal: {
          black: "#050505",
          panel: "rgba(0,0,0,0.6)",
          line: "rgba(209,23,23,0.36)",
          gray: "#9ca3af"
        }
      },
      fontFamily: {
        display: ["Oswald", "Bebas Neue", "Impact", "Arial Narrow", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
        sans: ["Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        "red-glow": "0 0 24px rgba(209, 23, 23, 0.22)",
        "red-hard": "0 0 0 1px rgba(209, 23, 23, 0.42), 0 0 36px rgba(209, 23, 23, 0.22)"
      },
      keyframes: {
        boot: {
          "0%, 100%": { opacity: "0.86" },
          "45%": { opacity: "1" },
          "50%": { opacity: "0.35" },
          "55%": { opacity: "1" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        meterPulse: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.45)" }
        }
      },
      animation: {
        boot: "boot 1.1s steps(2, end) infinite",
        scan: "scan 5.6s linear infinite",
        "meter-pulse": "meterPulse 1.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
