<template>
  <div class="desktop:block hidden">
    <div
      class="flex flex-col items-center desktop:mt-[155px] mt-[120px] mb-[50px]"
    >
      <div
        class="flex flex-col uppercase items-center gap-[14px] desktop:gap-[30px] mx-auto my-auto"
      >
        <h1
          class="title text-center desktop:text-[40px] desktop:leading-[10px] text-[32px] leading-[10px]"
        >
          Освещение
        </h1>
        <div
          class="desktop:text-[18px] min-h-[27px] text-[10px] font-TT font-bold text-center"
        >
          Подкатегории
        </div>
      </div>
    </div>
  </div>
  <div
    class="desktop:block hidden desktop:mb-[20px] mb-[10px] text-[14px] text-end uppercase px-[20px] flex desktop:justify-end align-center gap-3"
  >
    <RouterLink class="text-customGray" to="/"> ГЛАВНАЯ </RouterLink>
    - <RouterLink to="#">Освещение</RouterLink>
  </div>
  <LightingSubcategories />

  <LighthingNewProducts />
  <div class="desktop:aspect-video aspect-[4/5]"><AboutVideo /></div>
</template>

<script setup lang="ts">
import AboutVideo from "../HomePage/AboutVideo.vue";
import LighthingNewProducts from "./LighthingNewProducts.vue";

import LightingSubcategories from "./LightingSubcategories.vue";
</script>

<style lang="css" scoped></style>
