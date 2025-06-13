<script setup lang="ts">
import MainScreen from "./MainScreen.vue";
import NewProducts from "./NewProducts.vue";
import AboutVideo from "./AboutVideo.vue";
import FeaturedCollection from "./FeaturedCollection.vue";
</script>

<template>
  <MainScreen />
  <FeaturedCollection />
  <NewProducts />
  <div class="desktop:aspect-video aspect-[4/5]">
    <AboutVideo />
  </div>
</template>

<style scoped></style>
