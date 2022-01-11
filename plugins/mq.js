import Vue from "vue"
import vueMq from "vue-mq"

export default Vue.use(vueMq, {
  breakpoints: {
    xs: 600,
    sm: 960,
    md: 1264,
    lg: 1904,
    xl: Infinity,
  },
})
