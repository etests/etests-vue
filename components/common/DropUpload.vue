<template>
  <div :style="{ height }">
    <v-card
      :class="$style.dropzone"
      dropzone
      tile
      :height="height"
      @drop.prevent="drop"
      @dragover.prevent
      @click="$refs.import.click()"
    >
      <v-overlay absolute class="pa-0 mt-0">
        <v-row justify="center" align="center">
          <v-col cols="12" :class="['text-center white--text', small ? '' : 'title']">
            Drag an image here
          </v-col>
          <v-col cols="12">
            <v-btn :small="small" color="primary" :loading="loading">
              or select image
            </v-btn>
          </v-col>
          <v-col cols="12" />
        </v-row>
      </v-overlay>
      <input v-show="false" ref="import" type="file" @change="selectFiles" />
    </v-card>
    <v-progress-linear
      v-show="uploadPercentage > 0"
      value="uploadPercentage"
      color="success lighten-5"
    />
  </div>
</template>
<script>
export default {
  props: {
    small: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: "200px"
    },
    saveOnServer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadPercentage: 0,
      loading: false,
      uploadUrl: `${process.env.API_URL}/images/`
    }
  },
  methods: {
    drop(e) {
      const html = e.dataTransfer.getData("text/html")
      const files = e.target.files || e.dataTransfer.files
      if (html && html.length) {
        const regex = /src="?([^"\s]+)"?\s*/
        let url = regex.exec(html)
        if (!url || url.length < 1) return
        else url = url[1]
        const vm = this
        this.checkImage(url, function(valid) {
          if (valid) {
            vm.$emit("upload", url)
            if (vm.saveOnServer) {
              let formData = { url }
              vm.uploadImage(formData)
            }
          } else vm.$toast.error("Invalid Image")
        })
      } else if (files && files.length) {
        const file = files[0]
        const formData = new FormData()
        formData.append("file", file, file.name)
        this.$emit("upload", "")
        if (file.type.indexOf("image") === 0) this.uploadImage(formData)
      }
    },
    selectFiles(e) {
      const file = e.target.files[0]
      const vm = this
      if (file.type.indexOf("image") === 0) {
        const reader = new FileReader()
        reader.onload = (event) => vm.$emit("upload", event.target.result)
        reader.readAsDataURL(file)
        const formData = new FormData()
        formData.append("file", file, file.name)
        vm.uploadImage(formData)
      }
    },
    uploadImage(formData) {
      this.loading = true
      this.$axios
        .post(this.uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
          },
          onUploadProgress: function(event) {
            this.uploadPercentage = parseInt(Math.round((event.loaded / event.total) * 100))
          }.bind(this)
        })
        .then(this.afterUpload, (error) => {
          this.$emit("upload", "")
          this.$toast.error(error)
          this.loading = false
        })
    },
    afterUpload(response) {
      const data = response.data
      if (data && data.uploaded === 1) {
        this.$emit("upload", data.url)
      } else if (data.error && data.error.message) {
        this.$emit("upload", "")
        this.$toast.error(data.error.message)
      }
      this.uploadPercentage = 0
      this.loading = false
    },
    checkImage(url, callback) {
      const image = new Image()
      image.onload = function() {
        callback(true)
      }
      image.onerror = function() {
        callback(false)
      }
      image.src = url
    }
  }
}
</script>
<style module lang="scss">
.dropzone {
  cursor: pointer;
  background: transparent;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 0;
  height: 100%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: blur(10px);
  }
}
</style>
