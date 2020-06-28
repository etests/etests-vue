<template>
  <client-only>
    <v-row>
      <v-dialog v-model="newBatchDialog" max-width="400">
        <v-card flat>
          <v-card-title> New Batch </v-card-title>
          <v-divider />
          <v-card-text class="pt-5">
            <v-text-field solo-inverted flat label="Name" v-model="newBatch.name" />
            <v-text-field solo-inverted flat label="Joining Key" v-model="newBatch.joiningKey" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :loading="status.creating" @click="addNewBatch">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col cols="12" md="auto" class="display-2">
        Batches
      </v-col>
      <v-spacer />
      <v-col cols="12" md="auto">
        <v-btn v-show="batches && batches.length" color="primary" @click="newBatchDialog = true">
          Add Batch
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col v-if="status.loading" cols="12" justify="center" align="center">
        <v-card class="page">
          <v-card-title>
            <v-skeleton-loader type="text" />
          </v-card-title>
          <v-divider />
          <v-card-text class="px-0">
            <v-skeleton-loader v-for="i in 4" :key="i" type="list-item-avatar-three-line" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-else-if="!batches || !batches.length">
        <v-btn color="primary" large @click="newBatchDialog = true">
          add batch
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" v-for="(batch, i) in batches" :key="i">
        <Batch
          :batches="
            batches.map((batch, i) => {
              return { text: batch.name, value: batch.id }
            })
          "
          :batch="batch"
        />
      </v-col>
    </v-row>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex"
import Batch from "./Batch"

export default {
  components: {
    Batch
  },
  data() {
    return {
      newBatchDialog: false,
      newBatch: {
        name: "",
        joiningKey: ""
      }
    }
  },
  computed: {
    ...mapGetters({
      status: "batches/status",
      batches: "batches/items"
    })
  },
  created() {
    this.$store.cache.dispatch("batches/list")
  },
  methods: {
    addNewBatch() {
      this.$store.dispatch("batches/create", this.newBatch)
      this.newBatchDialog = false
    }
  }
}
</script>
