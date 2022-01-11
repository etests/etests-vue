<template>
  <v-container fluid class="grey lighten-5" style="height: 100%;">
    <v-overlay v-model="searchDialog" />
    <component :is="header" />
    <v-main app class="mx-0">
      <v-row v-if="isNaN(tab)" justify="start">
        <v-col
          v-for="(control, i) in controls"
          :key="i"
          cols="6"
          md="3"
          class="text-center pa-auto"
          v-show="
            !control.institute || (control.institute && $handle.length && $handle !== 'public')
          "
        >
          <v-col cols="12">
            <v-hover #default="{ hover }">
              <v-btn
                :elevation="hover ? 10 : 4"
                small
                :class="$style.icon"
                :color="hover || tab === i ? control.color : 'white'"
                :dark="hover || tab === i"
                :to="control.link ? control.link.path : `/dashboard?tab=${i}`"
              >
                <transition appear enter-active-class="animated zoomIn">
                  <v-icon :color="hover || tab === i ? '' : control.color" style="font-size: 60px">
                    {{ control.icon }}
                  </v-icon>
                </transition>
              </v-btn>
            </v-hover>
            <v-col cols="12">
              <strong :class="`${control.color}--text`">
                {{ control.name }}
              </strong>
            </v-col>
          </v-col>
        </v-col>
      </v-row>

      <v-row v-else class="text-center">
        <v-col cols="12" md="1">
          <v-row justify="center" align="center">
            <v-col
              v-for="(control, i) in controls"
              :key="i"
              cols="auto"
              md="12"
              v-show="
                !control.institute || (control.institute && $handle.length && $handle !== 'public')
              "
            >
              <v-tooltip right>
                <template #activator="{ on }">
                  <v-hover #default="{ hover }">
                    <v-btn
                      small
                      :class="[$style.tab, ['xs', 'sm'].includes($mq) ? 'mx-4' : '']"
                      :color="hover || tab == i ? control.color : 'white'"
                      :dark="hover || tab == i"
                      :to="
                        control.link ? control.link.path : { path: 'dashboard', query: { tab: i } }
                      "
                      exact
                      v-on="on"
                    >
                      <v-icon :color="hover || tab == i ? '' : control.color" large>
                        {{ control.icon }}
                      </v-icon>
                    </v-btn>
                  </v-hover>
                </template>
                <span>{{ control.name }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="tab !== null" cols="12" md="11" class="px-5">
          <v-row class="text-center" justify="center">
            <v-col
              v-for="(card, i) in controls[tab].cards"
              :key="i"
              :cols="expanded ? 12 : card.cols.sm"
              :md="expanded ? 12 : card.cols.md"
            >
              <component :is="card.component" :expand="expanded" height="100%" @toggle="expand" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import InstituteHeader from "@/components/institute/Header"
import StandardHeader from "@/components/public/Header"

export default {
  props: ["controls", "tab"],
  data() {
    return {
      searchDialog: false,
      defaultExpanded: null
    }
  },
  head() {
    return {
      title: !isNaN(this.tab) ? this.controls[this.tab].name : "Dashboard"
    }
  },
  computed: {
    small() {
      return ["xs", "sm"].includes(this.$mq)
    },
    header() {
      return this.$handle == "public" ? StandardHeader : InstituteHeader
    },
    expanded() {
      return this.defaultExpanded === null ? !this.small : this.defaultExpanded
    }
  },
  methods: {
    expand() {
      if (this.defaultExpanded === null) this.defaultExpanded = this.small
      else this.defaultExpanded = !this.defaultExpanded
    }
  }
}
</script>

<style module lang="scss">
.control {
  border-radius: 100%;
  cursor: pointer;
  margin: auto;
}
.tab {
  margin: 10px 0;
  height: 50px !important;
  width: 50px;
  border-radius: 12px;
}
.icon {
  height: 100px !important;
  width: 100px;
  border-radius: 12px;
}
</style>
