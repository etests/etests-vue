import utils from "@/js/utils"
import handleError from "@/services/errorService"

export default function({ $axios, isDev, env }) {
  if (isDev) $axios.setBaseURL("http://localhost:8000")
  else $axios.setBaseURL(env.API_URL)

  $axios.onRequest((config) => {
    let params = {}
    for (let key in config.params) {
      if (config.params[key] !== null) params[key] = config.params[key]
    }
    config.params = params
    if (config.params) config.params = utils.toSnakeCase(config.params)
  })

  $axios.onError((error) => {
    error.message = handleError(error)
  })
}
