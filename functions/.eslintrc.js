module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb",
  ],
  rules: {
    quotes: ["error", "double"],
  },
};
