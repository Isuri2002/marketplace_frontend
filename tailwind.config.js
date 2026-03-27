/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
        staatliches: ["Staatliches", "cursive"],
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        prim: {
          300: "#5B6BC0",
          DEFAULT: "#111691",
          700: "#0D0F5A",
          800: "#0A0A46",
          900: "#070732",
        },
        sec: {
          300: "#FFA35F",
          DEFAULT: "#FE7F0E",
          700: "#C66308",
          800: "#994D06",
          900: "#6B3604",
        },
        purple: "#A81894",
        muted: "#999999",
        "light-gray": "#BCBCBC",
        blue: "#007AFF",
      },
      screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};
