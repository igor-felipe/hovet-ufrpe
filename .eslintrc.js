module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:jest/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "eslint-config-airbnb-base", //you can omit "eslint-config-"
    "airbnb-typescript/base",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: [
    "@typescript-eslint", 
  ],
  rules: {
    "import/extensions": [0, "never"]
  },
}