let envFileName

if (process.env.NODE_ENV === "production") {
  envFileName = ".env.production"
} else {
  envFileName = ".env.local"
}

export default {
  head: {
    titleTemplate: "%s",
    title: "Home",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui"
      },
      {
        hid: "description",
        name: "description",
        content:
          "eTests is the new standard in online testing solutions. Attempt free tests of various competitive exams."
      }
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Montserrat|Open+Sans:400,600&display=swap&subset=latin-ext"
      }
    ]
  },

  loading: {
    name: "chasing-dots",
    color: "#2cce74",
    background: "white",
    height: "4px"
  },

  css: ["@/sass/main.sass"],

  plugins: [
    { src: "@/plugins/host", mode: "client" },
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
    "nuxt-mq",
    "nuxt-compress"
  ],

  "nuxt-compress": {
    gzip: {
      cache: true
    },
    brotli: {
      threshold: 10240
    }
  },

  dotenv: {
    filename: envFileName
  },

  generate: {
    fallback: true,
    interval: 100,
    subFolders: false
  },

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
        scheme: "refresh",
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
