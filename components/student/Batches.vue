<template>
  <StandardLayout>
    <v-dialog v-model="joinDialog" max-width="400">
      <v-card :class="$style.joinDialog">
        <v-card-title :class="$style.title"> Join {{ currentBatch.name }} </v-card-title>
        <template v-if="batchStatus.joining">
          <v-card-text>Please wait...</v-card-text>
        </template>
        <template v-else-if="batchStatus.joined">
          <v-card-text>Joined successfully!</v-card-text>
        </template>
        <template v-else>
          <v-card-text>Enter your joining credentials.</v-card-text>
          <v-row px-4>
            <v-col cols="12">
              <v-text-field v-model="rollNumber" solo-inverted flat label="Roll Number" required />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="joiningKey" solo-inverted flat label="Joining Key" required />
            </v-col>
          </v-row>
        </template>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="joinDialog = false">
            Close
          </v-btn>
          <v-btn
            v-if="!batchStatus.joining && !batchStatus.joined"
            color="primary"
            @click="join(currentBatch.id)"
          >
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-progress-circular
        v-if="batchStatus.loading"
        :size="70"
        :width="5"
        color="primary"
        indeterminate
        class="mt-12 ma-auto"
      />
      <template v-else-if="joinedInstitutes && joinedInstitutes.length">
        <SectionLayout
          v-for="institute in joinedInstitutes"
          :key="institute.id"
          :heading="institute.user.name"
        >
          <template v-if="institute.batches.length">
            <ObjectCard v-for="(batch, i) in institute.batches" :key="i">
              <div slot="content" :class="$style.content">
                <span :class="$style.title">{{ batch.name }}</span>
                <v-divider />
              </div>
              <div slot="actions">
                <v-btn
                  v-if="!institute.enrollments.includes(batch.id)"
                  rounded
                  outlined
                  color="primary"
                  @click="
                    currentBatch = batch
                    joinDialog = true
                  "
                >
                  Join
                </v-btn>
                <v-btn rounded outlined v-else color="primary" disabled>
                  Joined
                </v-btn>
              </div>
            </ObjectCard>
          </template>
          <template v-else>
            <span class="ml-2 title text-left">This institute has no batches.</span>
          </template>
        </SectionLayout>
      </template>
      <template v-else>
        <div class="ml-3 title text-left">
          No institute joined.
          <v-btn small color="primary" rounded outlined @click="$router.push('/institutes')">
            Search Institutes
          </v-btn>
          <br />To know more see
          <nuxt-link to="/faq">
            FAQ
          </nuxt-link>
        </div>
      </template>
    </v-row>
  </StandardLayout>
</template>

<script>
import { mapState } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"
import SectionLayout from "@/layouts/SectionLayout"
import ObjectCard from "@/layouts/ObjectCard"

export default {
  components: {
    StandardLayout,
    SectionLayout,
    ObjectCard
  },
  data() {
    return {
      batchIndex: 0,
      rollNumber: "",
      joiningKey: "",
      joinDialog: false,
      rollNumbers: "",
      currentBatch: {}
    }
  },
  created() {
    this.$store.cache.dispatch("institutes/getJoined")
  },
  computed: {
    ...mapState({
      status: (state) => state.institutes.status,
      joinedInstitutes: (state) => state.institutes.joined,
      batchStatus: (state) => state.batches.status
    })
  },
  methods: {
    join(id) {
      const data = {
        rollNumber: this.rollNumber,
        joiningKey: this.joiningKey
      }
      this.$store.cache.dispatch("batches/join", { id, data })
    }
  }
}
</script>

<style module lang="scss">
.joinDialog {
  border: 1px solid #dadce0;
  border-radius: 5px;
  font-family: "Open Sans", Arial, sans-serif;
  text-align: left;
  .title {
    font-size: 1.375rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
  .listBox {
    margin: 10px auto 5px;
    padding: 10px;
    width: 100%;
    height: 300px;
    border: 1px solid #999;
    border-radius: 5px;
  }
}
.content {
  min-height: 160px;
  background-color: #fcfcfc;
  border-radius: 8px 8px 0 0;
  padding: 20px;
  text-align: left;
  &:hover {
    background-color: #f5f5f5;
  }
}
.title,
.editTitle {
  text-align: left;
  font-size: 1.375rem;
  line-height: 1.75rem;
  color: #7e777e;
}
</style>
