module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // eslint-disable-next-line no-undef
    [`${__dirname}/node_modules/next/dist/compiled/postcss-flexbugs-fixes`]: {},
    // eslint-disable-next-line no-undef
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
