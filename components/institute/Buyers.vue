<template>
  <StandardLayout>
    <v-card :class="[$style.card, 'title elevation-3 text-xs-center']">
      <v-card-title>Datewise Test Series Purchases</v-card-title>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="processedBuyers"
          :class="$style.table"
          :single-expand="true"
          :expanded.sync="expanded"
          show-expand
        >
          <template #expanded-item="{ item }">
            <v-sheet>
              <v-row v-for="(purchase, i) in item.purchases" :key="i" align="center" flat pa-2>
                <v-col cols="6">
                  <strong>{{ purchase.testSeries }}</strong>
                </v-col>
                <v-col cols="6">
                  {{ purchase.count }}
                </v-col>
              </v-row>
            </v-sheet>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </StandardLayout>
</template>
<script>
import StandardLayout from "@/layouts/StandardLayout"

export default {
  components: {
    StandardLayout
  },
  data() {
    return {
      testSeriesMap: {},
      headers: [
        { text: "Date", value: "id", align: "center" },
        { text: "", value: "data-table-expand" }
      ],
      expanded: []
    }
  },
  computed: {
    buyers() {
      return this.$store.state.payments.buyers
    },
    processedBuyers() {
      if (!this.buyers || this.buyers.length === 0) return []
      else {
        const f = {}
        this.buyers.forEach((v) => {
          if (!f[v.dateAdded]) {
            f[v.dateAdded] = {}
            f[v.dateAdded][v.testSeries.id] = 1
            f[v.dateAdded].total = 1
            this.testSeriesMap[v.testSeries.id] = v.testSeries.name
          } else {
            if (!f[v.dateAdded][v.testSeries.id]) {
              this.testSeriesMap[v.testSeries.id] = v.testSeries.name
              f[v.dateAdded][v.testSeries.id] = 1
            } else f[v.dateAdded][v.testSeries.id] += 1
            f[v.dateAdded].total += 1
          }
        })
        return Object.entries(f).map(([id, purchaseMap]) => {
          let { total, ...purchases } = purchaseMap
          purchases = Object.entries(purchases).map(([testSeriesId, count]) => ({
            testSeries: this.testSeriesMap[testSeriesId],
            count
          }))
          return { id, purchases, total }
        })
      }
    }
  },
  created() {
    this.$store.cache.dispatch("payments/get")
  },
  methods: {}
}
</script>
<style module lang="scss">
.table {
  width: 100%;
  border-radius: 8px;
  padding: 20px 0;

  td {
    text-align: left;
  }
}
.card {
  padding: 10px 20px;
  width: 98%;
  border-radius: 8px;
  margin: 10px auto;
}
</style>
