<template>
  <client-only>
    <v-card class="page">
      <v-card-title>
        Students
        <v-spacer />
      </v-card-title>
      <v-divider />
      <v-card-text class="px-0">
        <template v-if="loading">
          <v-skeleton-loader v-for="i in 4" :key="i" type="list-item" />
        </template>
        <v-list v-else>
          <v-list-item-group>
            <v-list-item v-if="students.length === 0" disabled>
              <v-list-item-content> No Students </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(student, i) in students.slice(offset, offset + pageSize)"
              :key="i"
              dense
            >
              <v-list-item-icon>
                <v-icon color="primary">
                  mdi-account
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content> {{ student.name }} </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions v-if="students && students.length" class="pa-1">
        <v-spacer />
        <v-sheet max-width="100">
          <v-select
            v-model="pageSize"
            solo
            flat
            :items="[5, 10, 20, students.length]"
            label="Rows per page"
            dense
            class="mb-n6"
          />
        </v-sheet>
        <v-btn text icon :disabled="offset === 0" @click="offset = Math.max(0, offset - pageSize)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-sheet min-width="100">
          {{ offset + 1 }} - {{ Math.min(students.length, offset + pageSize) }} of
          {{ students.length }}
        </v-sheet>
        <v-btn
          text
          icon
          :disabled="offset === parseInt(students.length / pageSize)"
          @click="offset = Math.min(Math.max(0, students.length - 1), offset + pageSize)"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </client-only>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      offset: 0,
      pageSize: 5
    }
  },
  computed: {
    students() {
      return this.$store.state.students.items
    },
    loading() {
      return this.$store.state.students.status.loading
    }
  },
  created() {
    this.$store.cache.dispatch("students/list")
  },
  methods: {}
}
</script>
