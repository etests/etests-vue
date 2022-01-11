import Vue from "vue"
import * as VueGoogleMaps from "vue2-google-maps"

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDX9bDtzse0NKvnFFtJOY-G3DJMwSuZzHg",
    libraries: "places",
  },
  installComponents: true,
})
