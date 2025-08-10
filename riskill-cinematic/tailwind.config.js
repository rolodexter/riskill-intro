/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        onyx: "#0A0A0A",
        onyx2: "#0F1114",
        glass: "rgba(255,255,255,0.06)",
        edge: "#4BE1C3",
        accent: "#6BE5FF",
        textPri: "#E8EAED",
        textSec: "#AEB4BE"
      },
      backgroundImage: {
        'onyx-grad': 'radial-gradient(1200px 800px at 25% 10%, rgba(27,31,36,.75) 0%, rgba(10,10,12,1) 45%, #070708 100%)',
        'spot-1': 'radial-gradient(600px 360px at 30% 30%, rgba(107,229,255,.12), rgba(0,0,0,0))',
        'spot-2': 'radial-gradient(700px 420px at 80% 20%, rgba(75,225,195,.10), rgba(0,0,0,0))',
        'sheen': 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0))',
      },
      boxShadow: {
        glass: "0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 30px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(107,229,255,.18), 0 0 24px rgba(107,229,255,.08)"
      },
      backdropBlur: { xs: "2px" },
      opacity: { 15: ".15", 6: ".06" }
    }
  },
  plugins: []
}
