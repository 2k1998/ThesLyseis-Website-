/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
