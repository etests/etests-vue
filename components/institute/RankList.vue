<template>
  <v-card class="page" max-width="90%" style="margin-top: -64px;">
    <v-card-title>
      {{ title }} Result
      <v-btn @click="download" icon x-large>
        <v-icon>
          mdi-download
        </v-icon>
      </v-btn>
      <v-spacer />
      <v-text-field
        solo-inverted
        flat
        v-model="search"
        label="Search"
        dense
        style="max-width: 400px;"
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
          <v-btn dark small color="primary" :to="`/result/${item.id}`" target="_blank">
            Result
          </v-btn>
          <v-btn dark small color="primary" :to="`/review/${item.id}`" target="_blank">
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
          value: "rank",
        },
        { align: "center", text: "Name", value: "name" },
        { align: "center", text: "Marks", value: "marks" },
        { align: "center", text: "Detailed result", value: "actions", sortable: false },
      ],
    }
  },
  computed: {
    ranks() {
      var ranklist = this.rankList.ranks.map((session) => {
        var ranks = {
          id: session.id,
          rank: session.ranks ? session.ranks.overall : session.practice ? "Practice" : "NA",
          name: session.name,
          marks: session.marks.total,
          practice: session.practice,
        }
        session.subjects.forEach((subject, i) => {
          ranks[subject] = session.marks.sectionWise[i] + "/" + session.marks.maxMarks[i]
        })
        ranks["Overall"] = session.marks.total + "/" + session.marks.maxMarks.slice(-1)[0]
        return ranks
      })
      ranklist.sort((a, b) => (isNaN(a.rank) || a.rank > b.rank ? 1 : -1))
      return ranklist
    },
  },
  methods: {
    download() {
      let a = document.createElement("a")
      document.body.appendChild(a)
      a.style = "display: none"
      if (this.ranks.length == 0) return
      var { id, marks, practice, ...keys } = this.ranks[0]
      let data = Object.keys(keys).join(",")
      this.ranks.forEach((rank, i) => {
        var { id, marks, practice, ...rank } = rank
        data += "\n" + Object.values(rank).join(",")
      })
      let blob = new Blob([data], { type: "octet/stream" })
      let url = window.URL.createObjectURL(blob)
      a.href = url
      let fileName = `${this.title} Ranklist.csv`
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    },
  },
}
</script>
