/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/colors.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          yellow: "#EBC15A",
          green: "#429446",
        },
        squadre: {
          1: "#92AAD0",
          2: "#FBF595",
          3: "#F7B0B6",
          4: "#D5B6D5",
          5: "#B4E794",
          6: "#FF8175",
          7: "#A3F6FF",
          8: "#FFCE86",
          9: "#49B675",
        },
      },
      fontFamily: {
        roboto: ['"Roboto Mono"'],
      },
    },
  },
  plugins: [],
};
