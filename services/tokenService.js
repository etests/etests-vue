export const tokenService = {
  setToken,
  getAccessToken,
  getRefreshToken,
  clearToken,
}

function setToken(token) {
  let oldToken = getToken()
  let newToken = Object.assign(oldToken, token)
  localStorage.setItem("token", JSON.stringify(newToken))
}
function getToken() {
  return JSON.parse(localStorage.getItem("token"))
}
function getAccessToken() {
  const token = getToken()
  if (token) return token.access
  else return null
}
function getRefreshToken() {
  const token = getToken()
  if (token) return token.refresh
  else return null
}
function clearToken() {
  localStorage.removeItem("token")
}
