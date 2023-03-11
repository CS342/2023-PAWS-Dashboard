module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb",
    "prettier"
  ],
  rules: {
    quotes: ["error", "double"],
    "no-console": "off",
    "import/no-unresolved": "off"
  },
};
