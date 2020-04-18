module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  extends: ["plugin:vue/essential", "plugin:prettier/recommended", "plugin:prettier/recommended"],
  plugins: ["vue", "vuetify"],
  rules: {
    "no-unused-vars": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
}
