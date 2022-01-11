export default ({ $config }, inject) => {
  let ourDomain
  let handle
  let host

  ourDomain = $config.domain
  host = window.location.host.split(":")[0]

  const parts = host.split("." + ourDomain)
  const customDomain = !host.endsWith(ourDomain) && !/^([\d\.]+)$/.test(host)
  if (customDomain || (parts.length === 2 && parts[0] !== "www")) {
    if (customDomain) handle = host
    else handle = parts[0]
  } else handle = "public"

  inject("handle", handle)
}
