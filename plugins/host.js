export default ({ req }, inject) => {
  const ourDomain = "localhost"
  let host = null
  let handle = null

  if (process.server) {
    host = req.headers.host
  } else {
    host = window.location.host.split(":")[0]
  }

  const parts = host.split("." + ourDomain)
  let customDomain = !host.endsWith(ourDomain) && !/^([\d\.]+)$/.test(host)
  if (customDomain || (parts.length === 2 && parts[0] !== "www")) {
    if (customDomain) handle = host
    else handle = parts[0]
  } else handle = "public"

  inject("handle", handle)
}
