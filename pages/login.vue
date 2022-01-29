<template>
  <client-only>
    <HeroLayout>
      <v-col cols="12" class="py-12 px-0 ma-auto">
        <Login />
      </v-col>
    </HeroLayout>
  </client-only>
</template>

<script>
import HeroLayout from "@/layouts/HeroLayout"
import Login from "@/components/common/Login"

export default {
  components: {
    HeroLayout,
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
