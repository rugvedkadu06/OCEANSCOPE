// tailwind.config.js
export default {
  darkMode: 'class', // enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0c1324",
        surface: "#0c1324",
        "surface-container": "#191f31",
        "surface-container-low": "#151b2d",
        "surface-container-high": "#23293c",
        "surface-container-highest": "#2e3447",
        primary: "#a5e7ff",
        secondary: "#d0bcff",
        tertiary: "#d0ddff",
        outline: "#859399",
        "on-surface": "#dce1fb",
        accent: "#00d2ff",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(7, 13, 31, 0.5)",
      }
    },
  },
  plugins: [],
};
