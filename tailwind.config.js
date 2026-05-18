/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/globals.css",
    "./app/**/page.tsx",
    "./app/**/layout.tsx",
    "./components/**/*.tsx",
    // Unused duplicates — not imported anywhere; exclude from CSS scan
    "!./components/growth/StickyCTA.tsx",
    "!./components/growth/ScrollCTA.tsx",
    "!./components/growth/ViberButton.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5727A3",
          light: "#9153F4",
          soft: "#D6C5F0",
        },
        neutral: {
          gray: "#9E9E96",
        },
        background: "rgb(var(--background) / <alpha-value>)",
        "background-secondary":
          "rgb(var(--background-secondary) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-muted":
          "rgb(var(--foreground-muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-border": "rgb(var(--card-border) / <alpha-value>)",
        "nav-bg": "rgb(var(--nav-bg))",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
