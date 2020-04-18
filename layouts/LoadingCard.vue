<template>
  <v-col cols="12" sm="6" md="4" lg="3">
    <v-card :class="[$style.loadingCard, 'elevation-1']" />
  </v-col>
</template>

<style module lang="scss">
.loadingCard {
  width: 250px;
  height: 230px;
  width: 90%;
  border-radius: 8px;
  margin: 10px auto;
  animation: pulse 1.5s infinite ease-in-out;
}

@-webkit-keyframes pulse {
  0% {
    background-color: rgba(245, 245, 245, 0.3);
  }
  50% {
    background-color: rgba(245, 245, 245, 0.9);
  }
  100% {
    background-color: rgba(245, 245, 245, 0.3);
  }
}

@-moz-keyframes pulse {
  0% {
    background-color: rgba(245, 245, 245, 0.3);
  }
  50% {
    background-color: rgba(245, 245, 245, 0.9);
  }
  100% {
    background-color: rgba(245, 245, 245, 0.3);
  }
}

@-ms-keyframes pulse {
  0% {
    background-color: rgba(245, 245, 245, 0.3);
  }
  50% {
    background-color: rgba(245, 245, 245, 0.9);
  }
  100% {
    background-color: rgba(245, 245, 245, 0.3);
  }
}

@-o-keyframes pulse {
  0% {
    background-color: rgba(245, 245, 245, 0.3);
  }
  50% {
    background-color: rgba(245, 245, 245, 0.9);
  }
  100% {
    background-color: rgba(245, 245, 245, 0.3);
  }
}

@keyframes pulse {
  0% {
    background-color: rgba(245, 245, 245, 0.3);
  }
  50% {
    background-color: rgba(245, 245, 245, 0.9);
  }
  100% {
    background-color: rgba(245, 245, 245, 0.3);
  }
}
</style>
