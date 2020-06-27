<template>
  <v-card class="page" max-width="500" :loading="status.loading">
    <v-card-title>
      Batches
      <v-spacer />
      <v-btn color="primary" @click="joinDialog = true">Join a batch</v-btn>
    </v-card-title>
    <v-divider class="mb-4" />
    <v-card-text>
      <v-list>
        <v-list-item v-for="(enrollment, i) in enrollments" :key="i" :dense="!institute">
          <v-list-item-avatar>
            <v-icon color="primary">
              mdi-link
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span v-if="institute">{{ enrollment.batchName }}</span>
              <span v-else>{{ enrollment.institute }}</span>
            </v-list-item-title>
            <v-subheader class="ma-0 pa-0" v-if="!institute">
              {{ enrollment.batchName }}<br />
            </v-subheader>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon color="primary" @click.stop="remove(enrollment)">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-dialog v-model="joinDialog" max-width="600">
      <v-card class="object ma-auto" flat outlined>
        <v-card-title> Join a batch </v-card-title>
        <v-divider />
        <v-card-text class="pt-5">
          <v-select
            v-model="batch"
            solo-inverted
            flat
            :items="
              batches
                .filter((b) => !enrollments.find((e) => e.batch == b.id))
                .map((batch, i) => {
                  return {
                    text: batch.name + (institute ? '' : ` (${batch.instituteName})`),
                    value: batch.id
                  }
                })
            "
            label="Select batch"
          />
          <v-text-field solo-inverted flat label="Roll Number" v-model="rollNumber" />
          <v-text-field solo-inverted flat label="Joining Key" v-model="joiningKey" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="join" :loading="batchStatus.creating">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      batch: null,
      rollNumber: "",
      joiningKey: "",
      joinDialog: false
    }
  },
  computed: {
    institute() {
      if (this.$handle !== "public") return this.$store.getters["institutes/institute"]
      else return null
    },
    ...mapGetters({
      batchStatus: "batches/status",
      status: "enrollments/status",
      enrollments: "enrollments/items",
      batches: "batches/items"
    })
  },
  created() {
    var params = {}
    if (this.$handle !== "public") params = { institute__handle: this.$handle }
    this.$store.cache.dispatch("batches/listSimple", params)
    this.$store.cache.dispatch("enrollments/selfList", params)
  },
  methods: {
    remove(enrollment) {
      confirm(`Do you want to exit ${enrollment.batchName}?`) &&
        this.$store.dispatch("enrollments/selfRemove", enrollment.id)
    },
    join() {
      if (!this.joiningKey || this.joiningKey.length == 0) this.$toast.info("Enter joining key!")
      else {
        this.joinLoading = true
        this.$store.dispatch("enrollments/create", {
          batch: this.batch,
          rollNumber: this.rollNumber,
          joiningKey: this.joiningKey
        })
      }
      this.joinDialog = false
    }
  }
}
</script>
