import Vue from "vue"
import Vuetify from "vuetify/lib"

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    options: {
      customProperties: true
    },
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
})
