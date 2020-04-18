<template>
  <v-col cols="12" sm="6" md="4" lg="3">
    <v-card :class="$style.objectCard">
      <v-row justify="center">
        <v-col cols="12" class="py-0 my-0">
          <v-card flat>
            <slot name="content" />
          </v-card>
        </v-col>
      </v-row>
      <v-divider class="grey lighten-2" />
      <v-card min-height="40" class="text-center elevation-0">
        <slot name="actions" />
      </v-card>
    </v-card>
  </v-col>
</template>

<style module lang="scss">
@import "~@/sass/colors";
.objectCard {
  width: 250px;
  width: 90%;
  border-radius: 8px;
  margin: 10px auto;
  font-family: "Open Sans", Roboto, Arial, sans-serif;
  letter-spacing: 0.06rem;
}
</style>
