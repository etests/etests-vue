<template>
  <InstituteLayout>
    <v-row justify="center" align="center">
      <v-col class="display-2" cols="12" md="auto">
        {{ title }}
      </v-col>

      <v-spacer />

      <v-col cols="12" md="auto" class="text-center">
        <v-select
          v-model="subjectIndex"
          solo-inverted
          flat
          dense
          :items="
            faculty.map((subject, i) => {
              return { text: subject.subject, value: i }
            })
          "
          label="Select subject "
          class="mb-n7 mr-4"
          @change="newFaculty.subjectIndex = subjectIndex"
        />
      </v-col>
      <v-col cols="6" md="auto" class="text-center">
        <v-btn
          v-if="editable"
          v-show="
            faculty &&
              faculty.length &&
              faculty[subjectIndex].members &&
              faculty[subjectIndex].members.length
          "
          color="primary"
          @click="edit"
        >
          Add Member
        </v-btn>
      </v-col>
      <v-col cols="6" md="auto" class="text-center">
        <v-btn
          v-if="editable"
          v-show="
            faculty &&
              faculty.length &&
              faculty[subjectIndex].members &&
              faculty[subjectIndex].members.length
          "
          text
          color="primary"
          @click="
            newFaculty.subjectIndex = subjectIndex
            deleteDialog = true
          "
        >
          Delete
        </v-btn>
      </v-col>
    </v-row>

    <v-divider />

    <v-container>
      <v-row
        v-if="
          faculty &&
            (faculty.length === 0 ||
              !faculty[subjectIndex].members ||
              faculty[subjectIndex].members.length === 0)
        "
        justify="center"
        align="center"
        class="full-height"
      >
        <v-btn
          v-if="editable"
          v-show="
            faculty.length === 0 ||
              !faculty[subjectIndex].members ||
              faculty[subjectIndex].members.length === 0
          "
          x-large
          color="primary"
          @click="edit"
        >
          Add Member
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <span v-else>No members</span>
      </v-row>
      <v-row v-else>
        <v-col
          v-for="(person, i) in faculty[subjectIndex].members"
          :key="i"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card class="object ma-2" outlined flat hover height="100%">
            <v-img height="200px" :src="person.image">
              <v-menu v-if="editable" open-on-hover>
                <template #activator="{ on }">
                  <v-btn absolute top right icon color="white" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="editItem(i)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteItem(i)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </v-img>
            <v-divider />
            <v-card-title class="primary--text">
              {{ person.name }}
            </v-card-title>
            <v-card-text>
              <p class="multiline-truncate">
                {{ person.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-if="editable && faculty && faculty.length" v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>
          Delete Members
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col v-for="(member, i) in faculty[subjectIndex].members" :key="i" cols="3">
              <v-card @click="toggleImage(i)">
                <v-img :src="member.image" aspect-ratio="1" class="text-center">
                  <v-checkbox dark color="white" :input-value="selected" :value="i" class="ma-1" />
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="deleteDialog = false">
            Close
          </v-btn>
          <v-hover v-slot="{ hover }">
            <v-btn
              :color="hover ? 'error' : 'primary'"
              :disabled="selected.length === 0"
              @click="deleteConfirmation"
            >
              delete
            </v-btn>
          </v-hover>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" width="500">
      <v-card>
        <v-img :src="newFaculty.member.image" height="200px">
          <DropUpload
            @upload="
              (url) => {
                this.newFaculty.member.image = url
              }
            "
          />
          <template #placeholder>
            <v-skeleton-loader type="image" height="250px" />
          </template>
        </v-img>
        <v-divider />
        <v-card-text class="py-8">
          <v-select
            v-model="newFaculty.subjectIndex"
            solo-inverted
            flat
            :items="[
              { text: 'New Subject', value: -1 },
              ...faculty.map((subject, index) => {
                return { text: subject.subject, value: index }
              })
            ]"
            label="Select Subject"
          />
          <v-text-field
            v-show="newFaculty.subjectIndex === -1"
            v-model="newFaculty.subject"
            solo-inverted
            flat
            label="Subject name"
          />
          <v-text-field v-model="newFaculty.member.name" solo-inverted flat label="Name" />
          <v-text-field v-model="newFaculty.member.image" solo-inverted flat label="Image URL" />
          <v-textarea
            v-model="newFaculty.member.description"
            solo-inverted
            flat
            label=" Description"
            height="180"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="editDialog = false">
            cancel
          </v-btn>
          <v-btn color="primary" @click="save">
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </InstituteLayout>
</template>

<script>
import { mapGetters } from "vuex"
import InstituteLayout from "@/layouts/InstituteLayout"
import DropUpload from "@/components/common/DropUpload"

export default {
  components: {
    DropUpload,
    InstituteLayout
  },
  head() {
    return {
      title: "Faculty"
    }
  },
  data() {
    return {
      subjectIndex: 0,
      selected: [],
      editDialog: false,
      deleteDialog: false,
      defaultFaculty: {
        subjectIndex: -1,
        memberIndex: -1,
        subject: "",
        member: {
          name: "",
          description: "",
          image: ""
        }
      },
      newFaculty: {
        subjectIndex: -1,
        memberIndex: -1,
        subject: "",
        member: {
          name: "",
          description: "",
          image: ""
        }
      }
    }
  },
  methods: {
    toggleImage(i) {
      const index = this.selected.indexOf(i)
      if (index === -1) this.selected.push(i)
      else this.selected.splice(index, 1)
    },
    deleteConfirmation() {
      if (this.selected.length)
        confirm("Are you sure you want to delete thease members ?") && this.deleteMembers()
    },
    deleteMembers() {
      if (this.selected.length && this.subjectIndex > -1) {
        const members = this.faculty[this.subjectIndex].members.filter(
          (item, index) => !this.selected.includes(index)
        )
        this.faculty = [
          ...this.faculty.slice(0, this.subjectIndex),
          {
            subject: this.faculty[this.subjectIndex].subject,
            members
          },
          ...this.faculty.slice(this.subjectIndex + 1)
        ]
        this.deleteDialog = false
      }
    },
    edit() {
      this.newFaculty = {
        subject: "",
        subjectIndex: -1,
        member: { ...this.defaultFaculty.member }
      }
      if (this.faculty && this.faculty.length && this.subjectIndex > -1)
        this.newFaculty.subjectIndex = this.subjectIndex
      this.editDialog = true
    },
    editItem(index) {
      this.newFaculty.subjectIndex = this.subjectIndex
      if (this.subjectIndex > -1 && index !== null && index > -1) {
        this.newFaculty.member = Object.assign({}, this.faculty[this.subjectIndex].members[index])
        this.newFaculty.memberIndex = index
      }
      this.editDialog = true
    },
    deleteItem(index) {
      if (
        this.subjectIndex > -1 &&
        index !== null &&
        index > -1 &&
        confirm("Are you sure you want to delete this item?")
      ) {
        const updatedSubject = Object.assign(
          {},
          {
            subject: this.faculty[this.subjectIndex].subject,
            members: [
              ...this.faculty[this.subjectIndex].members.slice(0, index),
              ,
              ...this.faculty[this.subjectIndex].members.slice(index + 1)
            ]
          }
        )
        this.faculty = [
          ...this.faculty.slice(0, index),
          updatedSubject,
          ...this.faculty.slice(index + 1)
        ]
      }
    },
    save() {
      const subjectIndex = this.newFaculty.subjectIndex
      const memberIndex = this.newFaculty.memberIndex

      // delete this.newFaculty.subjectIndex;
      // delete this.newFaculty.memberIndex;

      if (subjectIndex === -1) {
        this.faculty = this.faculty.concat({
          subject: this.newFaculty.subject,
          members: [this.newFaculty.member]
        })
      } else {
        let members = []
        if (this.newFaculty.memberIndex > -1) {
          this.faculty[subjectIndex].members[memberIndex] = {
            ...this.newFaculty.member
          }
          members = this.faculty[subjectIndex].members
        } else members = this.faculty[subjectIndex].members.concat([this.newFaculty.member])
        this.faculty = [
          ...this.faculty.slice(0, subjectIndex),
          {
            subject: this.faculty[subjectIndex].subject,
            members
          },
          ...this.faculty.slice(subjectIndex + 1)
        ]
      }
      this.editDialog = false
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status"
    }),
    title() {
      const defaultTitle = "Our Faculty"
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        const exists = this.institute.settings.sections.find(
          (section) => section.component === this.$route.meta.title
        )
        if (exists && exists.name && exists.name.length) return exists.name
        else return defaultTitle
      } else return defaultTitle
    },
    faculty: {
      get() {
        if (this.institute) return this.institute.faculty
        else return []
      },
      set(faculty) {
        this.$store.cache.dispatch("institutes/update", {
          faculty,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
