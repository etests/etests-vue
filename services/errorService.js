function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object
}

function isArray(value) {
  return value && typeof value === "object" && value.constructor === Array
}

function formatFieldName(title) {
  let formatted = title
    .replace(/\.?([A-Z])/g, function(_, y) {
      return " " + y
    })
    .replace(/^ /, "")
  return formatted[0].toUpperCase() + formatted.slice(1)
}

function mergeErrors(data) {
  let messages = []
  if (isObject(data)) {
    for (let key in data) {
      if ([("error", "detail")].some((label) => key.toLowerCase().includes(label)))
        messages.push("<b>" + mergeErrors(data[key]) + "</b>")
      else messages.push("<b>" + formatFieldName(key) + ": " + mergeErrors(data[key]) + "</b>")
    }
    return messages.join("<br/>")
  } else if (isArray(data)) {
    data.forEach((message) => messages.push(mergeErrors(message)))
    return messages.join("<br/>")
  } else return data
}

export default function handleError(error) {
  if (error.response) return mergeErrors(error.response.data)
  else if (error.status >= 400 && error.status < 500) return "Not Allowed"
  else if (error.status >= 500) return "Internal Server Error"
  else if (error.request) return error.request.statusText
  else return error.statusText
}
