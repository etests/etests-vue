<template>
  <v-card class="page mb-8">
    <v-card-title>
      {{ batch.name }}
      <v-spacer />
      <v-btn icon @click="download">
        <v-icon>mdi-download</v-icon>
      </v-btn>
      <v-btn icon @click="download(false)">
        <v-icon>mdi-email</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text class="pa-0">
      <template v-if="status.loading">
        <v-skeleton-loader v-for="i in 4" :key="i" type="list-item" />
      </template>
      <template v-else>
        <v-row justify="center" align="start">
          <v-col cols="12" md="7" :class="!['xs', 'sm'].includes($mq) ? 'pr-0' : ''">
            <v-list>
              <v-list-item v-if="batch.enrollments.length === 0" disabled>
                <v-list-item-content> No Students </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="(enrollment, i) in batch.enrollments.slice(offset, offset + pageSize)"
                :key="i"
                dense
                @click="
                  selectedEnrollment = enrollment
                  updateEnrollmentDialog = true
                "
              >
                <v-list-item-avatar>
                  <v-img :src="enrollment.student.image" v-if="enrollment.student.image" />
                  <v-icon color="primary" v-else>
                    mdi-account
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ enrollment.student.name }}
                  </v-list-item-title>
                  <v-subheader class="ma-0 pa-0" style="line-height: 20px">
                    {{ enrollment.student.phone }}<br />
                    {{ enrollment.student.email }} <br />
                  </v-subheader>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="primary" @click.stop="remove(enrollment)">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-divider />
            <v-card-actions v-if="batch.enrollments && batch.enrollments.length" class="pa-1">
              <v-spacer />
              <v-sheet max-width="100">
                <v-select
                  v-model="pageSize"
                  solo
                  flat
                  :items="[5, 10, 20]"
                  label="Rows per page"
                  dense
                  class="mb-n6"
                />
              </v-sheet>
              <v-btn
                text
                icon
                :disabled="offset === 0"
                @click="offset = Math.max(0, offset - pageSize)"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-sheet min-width="100">
                {{ offset + 1 }} - {{ Math.min(batch.enrollments.length, offset + pageSize) }} of
                {{ batch.enrollments.length }}
              </v-sheet>
              <v-btn
                text
                icon
                :disabled="offset + pageSize > batch.enrollments.length - 1"
                @click="
                  offset = Math.min(Math.max(0, batch.enrollments.length - 1), offset + pageSize)
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
          <v-divider vertical class="ma-0 pa-0 hidden-sm-and-down" />
          <v-col cols="12" md="4" class="text-center mx-auto">
            <v-form>
              <v-card class="ma-auto" flat>
                <v-card-subtitle>Change Joining Key </v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    solo-inverted
                    flat
                    label="Enter Joining Key"
                    v-model="batch.joiningKey"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" @click="updateKey(batch)" :loading="status.updating"
                    >Submit</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </template>
    </v-card-text>

    <v-dialog v-model="updateEnrollmentDialog" v-if="selectedEnrollment" max-width="400">
      <v-card flat>
        <v-card-title> Update Student </v-card-title>
        <v-divider />
        <v-card-text class="pt-5">
          <v-row class="text-center">
            <v-col cols="12">
              <v-avatar size="120">
                <v-img
                  :src="selectedEnrollment.student.image"
                  v-if="selectedEnrollment.student.image"
                />
                <v-img v-else :src="require('@/assets/images/icons/profile.png')" />
              </v-avatar>
            </v-col>
            <v-col cols="12" class="title">
              {{ selectedEnrollment.student.name }}
            </v-col>
            <v-col>
              <v-text-field
                solo-inverted
                flat
                label="Roll number"
                v-model="selectedEnrollment.rollNumber"
              />
              <v-select
                v-model="selectedEnrollment.batch"
                solo-inverted
                flat
                :items="batches"
                label="Select batch"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            :loading="enrollmentStatus.updating"
            @click="updateEnrollment(selectedEnrollment)"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex"

export default {
  props: ["batch", "batches"],
  data() {
    return {
      offset: 0,
      pageSize: 5,
      updateEnrollmentDialog: false,
      selectedEnrollment: null
    }
  },
  computed: {
    ...mapGetters({
      status: "batches/status",
      enrollmentStatus: "enrollments/status"
    })
  },
  methods: {
    download(full = true) {
      let a = document.createElement("a")
      document.body.appendChild(a)
      a.style = "display: none"
      let data
      if (full) data = JSON.stringify(this.batch, null, 2)
      else
        data = this.batch.enrollments
          .map((enrollment) => enrollment.student.email.trim())
          .join("\n")
      let blob = new Blob([data], { type: "octet/stream" })
      let url = window.URL.createObjectURL(blob)
      a.href = url
      let fileName
      if (full) fileName = `${this.batch.name}.json`
      else fileName = `${this.batch.name}.txt`
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    },
    remove(enrollment) {
      confirm(`Do you want to remove ${enrollment.student.name}`) &&
        this.$store.dispatch("enrollments/remove", enrollment.id)
    },
    updateKey(batch) {
      this.$store.dispatch("batches/update", { id: batch.id, joiningKey: batch.joiningKey })
    },
    updateEnrollment(enrollment) {
      this.$store.dispatch("enrollments/update", enrollment)
      this.updateEnrollmentDialog = false
    }
  }
}
</script>
