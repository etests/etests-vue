<template>
  <StandardLayout>
    <template v-if="$auth.hasScope('student')">
      <StudentTests />
    </template>
    <template v-else-if="$auth.hasScope('institute')">
      <InstituteTests />
    </template>
    <template v-else-if="$auth.hasScope('staff')">
      <StaffTests />
    </template>
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import StudentTests from "@/components/student/Tests"
import InstituteTests from "@/components/institute/Tests"
import StaffTests from "@/components/staff/Tests"

export default {
  middleware: "login",
  components: {
    StandardLayout,
    StudentTests,
    InstituteTests,
    StaffTests,
  },
}
</script>
