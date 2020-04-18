let utils = {
  formatDate,
  formatDuration,
  durationToMilliseconds,
  uploadData,
  downloadData,
  getDateAfterDays,
  toSnakeCase,
  getAverageColor
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

function digitOffset(x) {
  if (x < 10) return "0" + x
  else return x
}

function _12HoursFormat(hours) {
  if (hours <= 12) return hours
  else return hours - 12
}

function formatDate(dateString, showTime = true) {
  if (!dateString || dateString === "") return ""
  else {
    let date = new Date(Date.parse(dateString))
    let am_pm = date.getHours() < 12 ? "AM" : "PM"
    let formattedDate =
      months[date.getMonth()] + " " + digitOffset(date.getDate()) + ", " + date.getFullYear()
    if (showTime)
      formattedDate +=
        " " +
        digitOffset(_12HoursFormat(date.getHours())) +
        ":" +
        digitOffset(date.getMinutes()) +
        " " +
        am_pm
    return formattedDate
  }
}
function getDateAfterDays(days) {
  if (isNaN(days)) days = 0
  let today = new Date()
  today.setDate(today.getDate() + days)
  let dd = today.getDate()
  let mm = today.getMonth() + 1
  let y = today.getFullYear()
  return y + "-" + mm + "-" + dd
}

function formatDuration(duration) {
  if (!duration || duration.length < 6) return undefined
  else if (duration.length > 6) return duration
  else
    return (
      duration.substring(0, 2) + ":" + duration.substring(2, 4) + ":" + duration.substring(4, 6)
    )
}

function durationToMilliseconds(duration) {
  let parts = this.formatDuration(duration).split(":")
  parts = parts.map((part) => parseInt(part))
  return (parts[0] * 60 * 60 + parts[1] * 60 + parts[2]) * 1000
}

function uploadData(e) {
  let files = e.target.files

  for (let i = 0, f = files[i]; ; i++) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        try {
          resolve(JSON.parse(event.target.result))
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsText(f)
    })
  }
}

function downloadData(data) {
  let test = {
    id: data.id,
    name: data.name,
    timeAlotted: data.timeAlotted,
    questions: data.questions,
    sections: data.sections,
    answers: data.answers
  }
  let a = document.createElement("a")
  document.body.appendChild(a)
  a.style = "display: none"
  let json = JSON.stringify(test),
    blob = new Blob([json], { type: "octet/stream" }),
    url = window.URL.createObjectURL(blob)
  a.href = url
  let fileName
  if (data.id) fileName = `${data.name}_${data.id}.json`
  else fileName = `${data.name}.json`
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}

function toSnakeCase(code) {
  if (typeof code === "object") {
    let snakeCaseCode = {}
    for (let key in code) snakeCaseCode[toSnakeCase(key)] = toSnakeCase(code[key])
    return snakeCaseCode
  }
  if (typeof code === "array") return code.map((key) => toSnakeCase(key))
  if (typeof code === "string")
    return code
      .replace(/(?:^|\.?)([A-Z])/g, function(x, y) {
        return "_" + y.toLowerCase()
      })
      .replace(/^_/, "")
  return code
}

function getAverageColor(img) {
  let context = document.createElement("canvas").getContext("2d")
  if (typeof img === "string") {
    let src = img
    img = new Image()
    img.setAttribute("crossOrigin", "")
    img.src = src
  }
  context.imageSmoothingEnabled = true
  context.drawImage(img, 0, 0, 1, 1)
  return context.getImageData(1, 1, 1, 1).data.slice(0, 3)
}

export default utils
