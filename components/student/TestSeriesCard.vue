<template>
  <v-card
    class="object"
    :min-width="['lg', 'xl'].includes($mq) ? '240px' : ''"
    outlined
    flat
    hover
    @click="$emit('select')"
  >
    <v-img
      :src="require('@/assets/images/bg/circle.svg')"
      max-height="80"
      class="primary white--text font-weight-bold"
    >
      <v-card-title class="text-truncate">
        {{ testSeries.name }}
      </v-card-title>
      <v-card-subtitle class="white--text font-weight-bold">
        {{ testSeries.institute }}
      </v-card-subtitle>
    </v-img>
    <v-divider />
    <v-card-text>
      <v-icon small color="primary">
        mdi-check-circle
      </v-icon>
      {{ testSeries.tests.length }} test{{ testSeries.tests.length === 1 ? "" : "s" }}
      <br />
      <v-icon small color="primary">
        mdi-check-circle
      </v-icon>
      <template v-if="testSeries.exams.length">
        {{ testSeries.exams.join(", ") }}
      </template>
    </v-card-text>
    <v-divider class="mt-5 mb-3" />
    <v-card-actions>
      <v-chip color="white" class="primary--text text-uppercase font-weight-bold">
        <template v-if="testSeries.price > 0"> rs. {{ testSeries.price }}/- </template>
        <template v-else>
          free
        </template>
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: ["testSeries"],
  data() {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions(["update", "remove"])
  }
}
</script>
