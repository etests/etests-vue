<template>
  <div class="dropdown" :class="{ 'is-active': active }">
    <div class="dropdown-menu" id="advancedOptions" role="menu">
      <div>
        <div class="dropdown-item">
          <div class="control">
            <label class="radio">
              <input value="" type="radio" name="transcode" @click="handleRadio" />
              <span>VP8-only</span>
            </label>
            <label class="radio">
              <input value="interop" type="radio" checked @click="handleRadio" name="transcode" />
              <span>VP8 &amp; H264</span>
            </label>
            <label class="radio">
              <input value="h264_interop" type="radio" @click="handleRadio" name="transcode" />
              <span>H264-only</span>
            </label>
          </div>
        </div>
        <div class="dropdown-item">
          <div class="select is-rounded">
            <select
              @change="handleSelect"
              value="480p_4"
              id="videoProfile"
              class="ag-rounded is-clipped"
            >
              <option
                v-for="(item, index) in resolutions"
                :key="index"
                :value="index.split(',')[0]"
              >
                {{ item[0] }}x{{ item[1] }}, {{ item[2] }}fps, {{ item[3] }}kbps
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      resolutions: {
        "120p,120p_1": [160, 120, 15, 65],
        "120p_3": [120, 120, 15, 50],
        "180p,180p_1": [320, 180, 15, 140],
        "180p_3": [180, 180, 15, 100],
        "180p_4": [240, 180, 15, 120],
        "240p,240p_1": [320, 240, 15, 200],
        "240p_3": [240, 240, 15, 140],
        "240p_4": [424, 240, 15, 220],
        "360p,360p_1": [640, 360, 15, 400],
        "360p_3": [360, 360, 15, 260],
        "360p_4": [640, 360, 30, 600],
        "360p_6": [360, 360, 30, 400],
        "360p_7": [480, 360, 15, 320],
        "360p_8": [480, 360, 30, 490],
        "360p_9": [640, 360, 15, 800],
        "360p_10": [640, 360, 24, 800],
        "360p_11": [640, 360, 24, 1000],
        "480p,480p_1": [640, 480, 15, 500],
        "480p_2": [640, 480, 30, 1000],
        "480p_3": [480, 480, 15, 400],
        "480p_4": [640, 480, 30, 750],
        "480p_6": [480, 480, 30, 600],
        "480p_8": [848, 480, 15, 610],
        "480p_9": [848, 480, 30, 930],
        "480p_10": [640, 480, 10, 400],
        "720p,720p_1": [1280, 720, 15, 1130],
        "720p_2": [1280, 720, 15, 2080],
        "720p_3": [1280, 720, 30, 1710],
        "720p_5": [960, 720, 15, 910],
        "720p_6": [960, 720, 30, 1380],
        "1080p,1080p_1": [1920, 1080, 15, 2080],
        "1080p_2": [1920, 1080, 30, 3000],
        "1080p_3": [1920, 1080, 30, 3150],
        "1080p_5": [1920, 1080, 60, 4780],
        "1440p,1440p_1": [2560, 1440, 30, 4850],
        "1440p_2": [2560, 1440, 60, 7350],
        "4k,4k_1": [3840, 2160, 30, 8910],
        "4k_3": [3840, 2160, 60, 13500]
      }
    }
  },

  props: ["onRadioChange", "onSelectChange"],

  methods: {
    handleRadio(e) {
      this.onRadioChange(e.target.value)
    },

    handleSelect(e) {
      this.onSelectChange(e.target.value)
    }
  }
}
</script>

<style scoped>
#advancedOptions .dropdown-content {
  border-radius: 12px;
  border: 1px solid rgb(0, 182, 237);
  background: #004a65;
  text-align: center;
  padding: 12px 3px;
  cursor: pointer;
}

#advancedOptions .dropdown-item:nth-child(2) select {
  padding: 0 10px 0 10px;
}

#advancedProfile {
  width: 105px;
  font-size: 12px;
  height: 32px;
  color: rgb(0, 182, 237);
  background: transparent;
  border: 1px solid rgb(0, 182, 237);
}

.dropdown.is-active .dropdown-menu {
  animation: dropdown 0.25s ease-in-out;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: scale(0.92) translate(0, -4px);
  }
  to {
    opacity: 1;
    transform: scale(none) translate(none);
  }
}
</style>
