module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},

    [`${__dirname}/node_modules/next/dist/compiled/postcss-flexbugs-fixes`]: {},

    [`${__dirname}/node_modules/next/dist/compiled/postcss-preset-env`]: {
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 3,
      features: {
        "custom-properties": false,
      },
    },
  },
};
