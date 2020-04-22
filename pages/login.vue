<template>
  <StandardLayout>
    <v-col cols="12" lg="8" class="ma-auto">
      <Login />
    </v-col>
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import Login from "@/components/common/Login"

export default {
  components: {
    StandardLayout,
    Login
  },
  head() {
    return {
      title: "Login"
    }
  }
}
</script>
