export default function({ app, redirect }) {
  let handle = app.$handle
  if (handle === "public") {
    return redirect("/404")
  }
}
