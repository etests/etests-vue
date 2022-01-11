module.exports = {
  root: true,
  parserOptions: {
    parser: "@babel/eslint-parser"
  },
  env: {
    browser: true
  },
  extends: ["eslint:recommended", "plugin:vue/essential", "plugin:prettier/prettier"],
  plugins: ["prettier", "vue", "vuetify"],
  rules: {
    "no-unused-vars": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
}
