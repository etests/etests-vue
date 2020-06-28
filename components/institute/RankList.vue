<template>
  <v-card class="page" max-width="90%" style="margin-top: -64px;">
    <v-card-title>
      {{ title }} Result
      <v-spacer />
      <v-text-field
        solo-inverted
        flat
        v-model="search"
        label="Search"
        dense
        style="max-width: 400px"
        prepend-inner-icon="mdi-magnify"
      />
    </v-card-title>
    <v-divider />
    <v-card-text class="px-0">
      <v-data-table
        v-if="rankList"
        :headers="rankHeaders"
        :search="search"
        :items="ranks"
        sort-by="rank"
      >
        <template #item.rank="{ item }">
          <strong v-if="item.practice" class="info--text"> {{ item.rank }} </strong>
          <strong v-else class="success--text">{{ item.rank }}</strong>
        </template>
        <template #item.actions="{ item }">
          <v-btn dark small color="primary" :to="`/result?id=${item.id}`" target="_blank">
            Result
          </v-btn>
          <v-btn dark small color="primary" :to="`/review?id=${item.id}`" target="_blank">
            Review
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["title", "rankList"],
  data() {
    return {
      search: "",
      rankHeaders: [
        {
          align: "center",
          text: "Rank",
          value: "rank"
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
          rank: session.ranks ? session.ranks.overall : session.practice ? "Practice" : "NA",
          name: session.name,
          marks: session.marks.total,
          practice: session.practice
        }
      })
    }
  }
}
</script>
