<template>
  <StandardLayout>
    <v-overlay v-if="status.loading" :value="true">
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>

    <template v-if="sections && sections.length">
      <div v-for="(section, i) in sections" :key="i">
        <v-row justify="center" align="center">
          <v-col class="display-1" cols="12" md="auto">
            <template v-if="editable && editing != null && editing == i">
              <v-text-field v-model="editItem.title" outlined label="Title" />
            </template>
            <template v-else>
              {{ section.title }}
            </template>
          </v-col>
          <v-spacer />
          <v-col cols="12" md="auto" v-if="editable && (editing == null || editing != i)">
            <v-btn icon @click="edit(i)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="remove(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="auto" v-else-if="editable">
            <v-btn color="primary" @click="save(i)">
              Save
            </v-btn>
            <v-btn icon @click="editing = null">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider />

        <v-container>
          <v-row justify="center" class="full-height">
            <v-col cols="12" lg="4">
              <template v-if="editable && editing != null && editing == i">
                <v-img :src="editItem.img">
                  <DropUpload
                    @upload="
                      (url) => {
                        editItem.img = url
                      }
                    "
                    height="100%"
                  />
                </v-img>
              </template>
              <template v-else>
                <v-img :src="section.img">
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                </v-img>
              </template>
            </v-col>

            <v-col cols="12" lg="8" class="text-justify">
              <template v-if="editable && editing != null && editing == i">
                <v-textarea v-model="editItem.text" filled label="Text" />
              </template>
              <template v-else>
                {{ section.text }}
              </template>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
    <div v-if="editable" v-show="addNew">
      <v-row justify="center" align="center">
        <v-col cols="12" md="auto" class="display-1 pb-0">
          <v-text-field v-model="editItem.title" outlined label="Title" />
        </v-col>
        <v-spacer />
        <v-col cols="12" md="auto" class="pb-0">
          <v-btn color="primary" @click="save(-1)">
            Save
          </v-btn>
          <v-btn icon @click="addNew = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider />

      <v-container>
        <v-row justify="center" class="full-height">
          <v-col cols="12" lg="4">
            <v-img :src="editItem.img" height="500px">
              <DropUpload
                @upload="
                  (url) => {
                    editItem.img = url
                  }
                "
                height="100%"
              />
            </v-img>
          </v-col>

          <v-col cols="12" lg="8" class="text-justify">
            <v-textarea v-model="editItem.text" filled label="Text" height="500px" />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-row justify="center" align="center" v-if="editable" v-show="!addNew">
      <v-col cols="12" md="auto" class="text-center">
        <v-btn x-large color="primary" @click="add">
          Add Section
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </StandardLayout>
</template>

<script>
import { mapGetters } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"
import DropUpload from "@/components/common/DropUpload"

export default {
  components: {
    StandardLayout,
    DropUpload,
  },
  middleware: "institute",
  head() {
    return {
      title: "About Us",
    }
  },
  data() {
    return {
      editing: null,
      addNew: false,
      editItem: {
        title: "",
        img: "",
        text: "",
      },
      newItem: {
        title: "",
        img: "",
        text: "",
      },
    }
  },
  methods: {
    edit(i) {
      this.editItem = { ...this.sections[i] }
      this.editing = i
    },
    save(i) {
      if (i == -1) {
        this.sections = this.sections.concat(this.editItem)
        this.addNew = false
      } else
        this.sections = [
          ...this.sections.slice(0, i),
          {
            ...this.editItem,
          },
          ...this.sections.slice(i + 1),
        ]
      this.editing = null
    },
    add() {
      this.editItem = { ...this.newItem }
      this.addNew = true
    },
    remove(i) {
      if (confirm("Are you sure you want to delete this section?"))
        this.sections = [...this.sections.slice(0, i), ...this.sections.slice(i + 1)]
    },
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status",
    }),
    sections: {
      get() {
        if (this.institute && this.institute.extras && this.institute.extras.about)
          return this.institute.extras.about
        else return []
      },
      set(sections) {
        var extras = { ...this.institute.extras }
        extras.about = sections
        this.$store.cache.dispatch("institutes/update", {
          extras,
          handle: this.institute.handle,
        })
      },
    },
  },
}
</script>
