export default function({ app, redirect }) {
  let handle = app.$handle
  if (handle && handle.length && handle !== "public") {
    return redirect("/404")
  }
}
