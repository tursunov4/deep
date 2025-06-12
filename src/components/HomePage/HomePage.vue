<script setup lang="ts">
import { onMounted } from "vue";

import MainScreen from "./MainScreen.vue";
import NewProducts from "./NewProducts.vue";
import AboutVideo from "./AboutVideo.vue";
import FeaturedCollection from "./FeaturedCollection.vue";

onMounted(() => {
  const title = "Bosh sahifa | Mening Saytim";
  const description =
    "Bu saytingizning bosh sahifa tavsifi. SEO uchun foydali bo‘ladi.";

  // Title qo‘yish
  document.title = title;

  // Meta description qo‘yish yoki yangilash
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  } else {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    metaDescription.setAttribute("content", description);
    document.head.appendChild(metaDescription);
  }
});
</script>

<template>
  <MainScreen />
  <FeaturedCollection />
  <NewProducts />
  <div class="desktop:aspect-video aspect-[4/5]">
    <AboutVideo />
  </div>
</template>

<style scoped>
/* Style yozilsa bo'ladi */
</style>
