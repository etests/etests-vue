export default function({ $auth, route, redirect }) {
  if (!$auth.loggedIn) {
    return redirect({ path: "/login", query: { redirect: route.fullPath } })
  }
}
