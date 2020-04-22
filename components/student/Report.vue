<template>
  <v-card class="page">
    <v-card-title>
      Results
    </v-card-title>
    <v-col cols="12">
      <v-data-table
        v-if="sessions"
        :headers="sessionHeaders"
        :items="sessions"
        sort-by="time"
        :search="sessionSearch"
        :sort-desc="true"
      >
        <template #item.name="{ item }">
          <span v-if="item.practice">{{ item.name }} (Practice)</span>
          <span v-else class="primary--text font-weight-bold">{{ item.name }}</span>
        </template>
        <template #item.time="{ item }">
          {{ formatDate(item["time"]) }}
        </template>
        <template #item.actions="{ item }">
          <v-btn dark small color="primary" :to="`/result?id=${item.id}`">
            Result
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-card>
</template>

<script>
import utils from "@/js/utils"

export default {
  data() {
    return {
      sessionSearch: "",
      pagination: {
        descending: true,
        rowsPerPage: 10
      },
      sessionHeaders: [
        { align: "left", text: "Test", value: "name" },
        {
          align: "center",
          text: "Attempted at",
          value: "time"
        },
        { align: "center", sortable: false, text: "Actions", value: "actions" }
      ]
    }
  },
  computed: {
    sessions() {
      return this.$store.state.sessions.all.items.map((session) => {
        return {
          id: session.id,
          name: session.test.name,
          time: session.checkinTime,
          practice: session.practice
        }
      })
    }
  },
  created() {
    this.$store.cache.dispatch("sessions/list")
  },
  methods: {
    formatDate(dateString) {
      return utils.formatDate(dateString)
    }
  }
}
</script>

<style module lang="scss">
.card {
  padding: 10px 20px;
  margin: auto;
  width: calc(100% - 20px);
  border-radius: 8px;

  td {
    text-align: left;
  }
}
</style>
