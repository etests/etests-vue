<template>
  <StandardLayout>
    <v-card class="page">
      <v-card-title>
        Payments
      </v-card-title>
      <v-divider />
      <v-col cols="4">
        <v-text-field
          v-model="transactionsearch"
          solo-inverted
          flat
          dense
          append-icon="mdi-magnify"
          label="Search"
          single-line
        />
      </v-col>

      <v-col cols="12">
        <v-data-table
          v-if="transcations"
          :headers="transactionheaders"
          :items="transcations"
          :search="transactionsearch"
          sort-by="dateAdded"
          :sort-desc="true"
        />
      </v-col>
    </v-card>
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"

export default {
  components: {
    StandardLayout,
  },
  data() {
    return {
      transactionsearch: "",
      creditsearch: "",
      transactionheaders: [
        { align: "center", text: "Date", value: "dateAdded" },
        {
          align: "center",
          text: "Amount Paid",
          value: "amount",
        },
        {
          align: "center",
          text: "Credits Added",
          value: "creditsAdded",
        },
        {
          align: "center",
          text: "Transaction ID",
          value: "transactionId",
          sortable: false,
        },
        { align: "center", text: "Mode", value: "mode" },
      ],
      creditheaders: [
        { align: "center", text: "Date", value: "dateAdded" },
        {
          align: "center",
          text: "Test",
          value: "test",
        },
        {
          align: "center",
          text: "Credits Used",
          value: "creditsUsed",
        },
      ],
    }
  },
  computed: {
    transcations() {
      return this.$store.state.transactions.items
    },
  },
  created() {
    this.$store.cache.dispatch("transactions/get")
  },
}
</script>
