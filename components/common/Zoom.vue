<template>
  <div class="iframe-container">
    <meta charset="utf-8" />
    <link
      type="text/css"
      rel="stylesheet"
      href="https://dmogdx0jrul3u.cloudfront.net/1.3.7/css/bootstrap.css"
    />
    <link
      type="text/css"
      rel="stylesheet"
      href="https://dmogdx0jrul3u.cloudfront.net/1.3.7/css/react-select.css"
    />

    <meta name="format-detection" content="telephone=no" />
  </div>
</template>
<script>
if (process.client) {
  require("zoomus-jssdk")
  ZoomMtg.setZoomJSLib("https://dmogdx0jrul3u.cloudfront.net/1.3.7/lib", "/av")
  ZoomMtg.preLoadWasm()
  ZoomMtg.prepareJssdk()
}
var API_KEY = "WKSmrFuOQk6_5Ens19A6Eg"
var API_SECRET = "10srf9pkIjyDUvHtpcjtHdkPsd0SBRXnh4aM"
export default {
  props: {
    meeting: Object
  },
  data() {
    return {
      meetConfig: {},
      signature: {}
    }
  },
  created() {
    console.log("dasfas")
    if (process.client) {
      this.meetConfig = {
        apiKey: API_KEY,
        apiSecret: API_SECRET,
        meetingNumber: this.meeting.number,
        userName: this.meeting.name,
        passWord: this.meeting.password,
        leaveUrl: "https://zoom.us",
        role: this.meeting.role
      }
      console.log(this.meetConfig)
      // Generate Signature function
      this.signature = ZoomMtg.generateSignature({
        meetingNumber: this.meetConfig.meetingNumber,
        apiKey: this.meetConfig.apiKey,
        apiSecret: this.meetConfig.apiSecret,
        role: this.meetConfig.role,
        success: function(res) {
          // eslint-disable-next-line
          console.log("success signature: " + res.result)
        }
      })
      // join function
      ZoomMtg.init({
        leaveUrl: "http://www.zoom.us",
        isSupportAV: true,
        success: () => {
          ZoomMtg.join({
            meetingNumber: this.meetConfig.meetingNumber,
            userName: this.meetConfig.userName,
            signature: this.signature,
            apiKey: this.meetConfig.apiKey,
            userEmail: "piyushkumarmaurya@gmail.com",
            passWord: this.meetConfig.passWord,
            success: function(res) {
              // eslint-disable-next-line
              console.log("join meeting success")
            },
            error: function(res) {
              // eslint-disable-next-line
              console.log("error", res)
            }
          })
        },
        error: function(res) {
          // eslint-disable-next-line
          console.log("error: ", res)
        }
      })
    }
  }
}
</script>
