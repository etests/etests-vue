<template>
  <v-data-table v-if="rankList" :headers="rankHeaders" :items="ranks" sort-by="rank">
    <template #item.rank="{ item }">
      <strong v-if="item.practice" class="info--text"> {{ item.rank }} </strong>
      <strong v-else class="success--text">{{ item.rank }}</strong>
    </template>
    <template #item.actions="{ item }">
      <v-btn rounded color="success" @click="$router.new(`/result/${item.id}`)">
        <v-icon>mdi-file-chart</v-icon> &nbsp; Analysis
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["rankList"],
  data() {
    return {
      rankHeaders: [
        {
          align: "center",
          text: "Rank",
          value: "rank"
        },
        {
          align: "center",
          text: "Roll Number",
          value: "roll_number"
        },
        { align: "center", text: "Name", value: "name" },
        { align: "center", text: "Marks", value: "marks" },
        { align: "center", text: "Detailed result", value: "actions", sortable: false }
      ]
    }
  },
  computed: {
    ranks() {
      return this.rankList.ranks.map((session) => {
        return {
          id: session.id,
          rank: session.ranks.overall,
          roll_number: session.roll_number,
          name: session.name,
          marks: session.marks.total,
          practice: session.practice
        }
      })
    }
  }
}
</script>
