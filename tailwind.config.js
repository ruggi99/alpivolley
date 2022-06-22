/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/colors.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          yellow: "#EBC15A",
          green: "#429446"
        },
        squadre: {
          1: "#F9810A",
          2: "#66BEEF",
          3: "#E46886",
          4: "#F94C0B",
          5: "#B4E794",
          6: "#0D7AD3",
          7: "#97F3FE",
          8: "#1F5C70",
        }
      }
    },
  },
  plugins: [],
}
