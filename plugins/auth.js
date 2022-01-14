export default function ({ $auth }) {
  $auth.$storage.setUniversal("loggedIn", $auth.$storage.getLocalStorage("loggedIn"))
  $auth.$storage.setUniversal("user", $auth.$storage.getLocalStorage("user"))
}
