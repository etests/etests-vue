<template>
  <client-only>
    <v-card class="page">
      <v-card-title>
        Students
        <v-spacer />
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
                <v-list-item v-if="students.length === 0" disabled>
                  <v-list-item-content> No Students </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="(student, i) in students.slice(offset, offset + pageSize)"
                  :key="i"
                  dense
                >
                  <v-list-item-avatar>
                    <v-img :src="student.image" v-if="student.image" />
                    <v-icon color="primary" v-else>
                      mdi-account
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ student.name }}
                    </v-list-item-title>
                    <v-subheader class="ma-0 pa-0" style="line-height: 20px">
                      {{ student.batch }}<br />
                      {{ student.email }} <br />
                    </v-subheader>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon color="primary" @click="remove(student)">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-divider />
              <v-card-actions v-if="students && students.length" class="pa-1">
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
                  {{ offset + 1 }} - {{ Math.min(students.length, offset + pageSize) }} of
                  {{ students.length }}
                </v-sheet>
                <v-btn
                  text
                  icon
                  :disabled="offset + pageSize > students.length - 1"
                  @click="offset = Math.min(Math.max(0, students.length - 1), offset + pageSize)"
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
                      :value="joiningKey"
                      @input="(value) => (updateKey = value)"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="save" :loading="status.updating">Submit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      dialog: false,
      offset: 0,
      pageSize: 5,
      updateKey: ""
    }
  },
  computed: {
    ...mapGetters({
      status: "students/status",
      joiningKey: "students/joiningKey",
      students: "students/students"
    })
  },
  created() {
    this.$store.cache.dispatch("students/list")
    this.$store.cache.dispatch("students/key")
  },
  methods: {
    remove(student) {
      confirm(`Do you want to remove ${student.name}`) &&
        this.$store.dispatch("students/remove", student.id)
    },
    save() {
      if (this.updateKey == null || this.updateKey.length == 0) this.updateKey = this.joiningKey
      this.$store.dispatch("students/update", { joiningKey: this.updateKey })
    }
  }
}
</script>
