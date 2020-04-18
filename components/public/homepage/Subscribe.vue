<template>
  <SectionLayout>
    <template slot="heading">
      Subscribe Now!
    </template>
    <template slot="subheading">
      Keep yourself updated about our latest features
    </template>
    <v-row slot="content" mt-5 justify="center">
      <v-col cols="10" md="8" lg="6">
        <v-form v-model="valid">
          <v-text-field
            v-model="name"
            solo-inverted
            flat
            :rules="nameRules"
            label="Name"
            outline
            required
          />
          <v-text-field
            v-model="email"
            solo-inverted
            flat
            :rules="emailRules"
            label="E-mail"
            outline
            required
          />
          <v-btn rounded large dark color="chill">
            Subscribe
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </SectionLayout>
</template>

<script>
import SectionLayout from "@/components/public/homepage/SectionLayout.vue"

export default {
  name: "Subscribe",
  components: {
    SectionLayout
  },
  data() {
    return {
      valid: false,
      name: "",
      nameRules: [(v) => v.length <= 10 || "Name must be less than 10 characters"],
      email: "",
      emailRules: [(v) => /.+@.+/.test(v) || "E-mail must be valid"]
    }
  }
}
</script>
