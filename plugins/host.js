export default ({ env }, inject) => {
  let ourDomain
  let handle
  let host

  ourDomain = env.DOMAIN

  host = window.location.host.split(":")[0]

  const parts = host.split("." + ourDomain)
  let customDomain = !host.endsWith(ourDomain) && !/^([\d\.]+)$/.test(host)
  if (customDomain || (parts.length === 2 && parts[0] !== "www")) {
    if (customDomain) handle = host
    else handle = parts[0]
  } else handle = "public"

  inject("handle", handle)
}
