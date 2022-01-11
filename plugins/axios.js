import utils from "@/js/utils"
import handleError from "@/services/errorService"

export default function ({ $axios, $config }) {
  $axios.setBaseURL($config.apiURL)

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
