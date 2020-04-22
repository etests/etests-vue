export default {
  mode: "universal",

  head: {
    titleTemplate: "%s",
    title: "Home",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "eTests is the new standard in online testing solutions. Attempt free tests of various competitive exams."
      }
    ],
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
  },

  loading: {
    name: "chasing-dots",
    color: "#2cce74",
    background: "white",
    height: "4px"
  },

  css: ["@/sass/main.sass"],

  plugins: [
    "@/plugins/host",
    "@/plugins/maps",
    "@/plugins/axios",
    { src: "@/plugins/shortkey", mode: "client" }
  ],

  buildModules: ["@nuxtjs/eslint-module", "@nuxtjs/vuetify"],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/pwa",
    "@nuxtjs/dotenv",
    "@nuxtjs/toast",
    "nuxt-mq"
  ],

  mq: {
    defaultBreakpoint: "default",
    breakpoints: {
      xs: 600,
      sm: 960,
      md: 1264,
      lg: 1904,
      xl: Infinity
    }
  },

  auth: {
    strategies: {
      local: {
        _scheme: "refresh",
        token: {
          property: "access"
        },
        refreshToken: {
          property: "refresh",
          data: "refresh"
        },
        grantType: false,
        clientId: false,
        autoFetchUser: false,
        user: false,
        endpoints: {
          login: { url: "login/", method: "post" },
          refresh: { url: "refresh/", method: "post" },
          logout: { url: "logout/", method: "post" },
          user: { url: "profile/", method: "get" }
        },
        tokenRequired: true,
        tokenType: "Bearer",
        autoRefresh: {
          enable: true
        },
        autoLogout: true
      }
    },
    redirect: {
      login: "/login",
      logout: "/",
      home: false
    }
  },

  toast: {
    position: "top-right",
    duration: 2000
  },

  vuetify: {
    customVariables: ["@/assets/variables.scss"],
    icons: {
      iconfont: "mdi"
    },
    theme: {
      options: {
        customProperties: true
      },
      light: true,
      themes: {
        light: {
          primary: "#2cce74",
          secondary: "#196b69",
          accent: "#82B1FF",
          error: "#ff4444",
          info: "#33b5e5",
          success: "#00C851",
          warning: "#ffbb33"
        }
      }
    }
  },

  build: {
    extend(config, ctx) {},
    transpile: [/^vue2-google-maps($|\/)/]
  }
}
