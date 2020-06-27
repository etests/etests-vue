<template>
  <client-only>
    <component :is="layout">
      <v-col cols="12" class="py-5 ma-auto">
        <Login />
      </v-col>
    </component>
  </client-only>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import InstituteLayout from "@/layouts/InstituteLayout"
import Login from "@/components/common/Login"

export default {
  components: {
    Login
  },
  head() {
    return {
      title: "Login"
    }
  },
  computed: {
    layout() {
      return this.$handle == "public" ? StandardLayout : InstituteLayout
    }
  }
}
</script>
