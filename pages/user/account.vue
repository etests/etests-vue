<template>
  <StandardLayout>
    <Profile />
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import Profile from "@/components/common/Profile"

export default {
  middleware: "login",
  components: {
    StandardLayout,
    Profile,
  },
}
</script>
