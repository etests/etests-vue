export default {
  ssr: false,

  head: {
    titleTemplate: "%s",
    title: "Home",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui",
      },
      {
        hid: "description",
        name: "description",
        content:
          "eTests is the new standard in online testing solutions. Attempt free tests of various competitive exams.",
      },
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css",
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Montserrat|Open+Sans:400,600&display=swap&subset=latin-ext",
      },
    ],
  },

  publicRuntimeConfig: {
    apiURL: process.env.API_URL,
    domain: process.env.DOMAIN,
  },

  privateRuntimeConfig: {},

  loading: {
    name: "chasing-dots",
    color: "#2cce74",
    background: "white",
    height: "4px",
  },

  plugins: [
    { src: "@/plugins/host", mode: "client" },
    { src: "@/plugins/shortkey", mode: "client" },
    "@/plugins/maps",
    "@/plugins/axios",
  ],

  buildModules: ["@nuxtjs/vuetify"],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/pwa",
    "@nuxtjs/toast",
    "nuxt-mq",
    "nuxt-compress",
  ],

  "nuxt-compress": {
    gzip: {
      cache: true,
    },
    brotli: {
      threshold: 10240,
    },
  },

  generate: {
    fallback: true,
    interval: 100,
    subFolders: false,
  },

  mq: {
    defaultBreakpoint: "default",
    breakpoints: {
      xs: 600,
      sm: 960,
      md: 1264,
      lg: 1904,
      xl: Infinity,
    },
  },

  auth: {
    plugins: [{ src: "@/plugins/auth", mode: "client" }],
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          property: "access",
          maxAge: 60 * 60 * 24,
          global: true,
          type: "Bearer",
        },
        refreshToken: {
          property: "refresh",
          data: "refresh",
          maxAge: 60 * 60 * 24 * 30,
        },
        user: {
          property: "user",
          autoFetch: false,
        },
        endpoints: {
          login: { url: "login/", method: "post" },
          refresh: { url: "refresh/", method: "post" },
          logout: { url: "logout/", method: "post" },
          user: { url: "profile/", method: "get" },
        },
        autoRefresh: {
          enable: true,
        },
        autoLogout: true,
      },
    },
    redirect: {
      login: "/login",
      logout: "/",
      home: false,
    },
  },

  target: "static",

  toast: {
    position: "top-right",
    duration: 2000,
  },

  css: ["@/styles/main.scss", "@/styles/vuetify.scss"],

  vuetify: {
    theme: {
      themes: {
        light: {
          primary: "#9155FD",
          accent: "#0d6efd",
          secondary: "#8A8D93",
          success: "#56CA00",
          info: "#16B1FF",
          warning: "#FFB400",
          error: "#FF4C51",
        },
      },
    },
  },

  build: {
    extend(config, ctx) {},
    transpile: [/^vue2-google-maps($|\/)/],
  },
}
