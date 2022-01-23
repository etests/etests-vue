<template>
  <client-only>
    <StandardLayout>
      <v-col cols="12" class="py-5 ma-auto">
        <Login />
      </v-col>
    </StandardLayout>
  </client-only>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import Login from "@/components/common/Login"

export default {
  components: {
    StandardLayout,
    Login,
  },
  head() {
    return {
      title: "Login",
    }
  },
  computed: {},
}
</script>
