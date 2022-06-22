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
          1: "#084B83",
          2: "#66BEEF",
          3: "#E46886",
          4: "#E89570",
          5: "#BBBE64",
          6: "",
          7: "",
          8: "",
        }
      }
    },
  },
  plugins: [],
}
