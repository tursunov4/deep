<script setup lang="ts">

import router from "../router";
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between">
      <div class="title w-1/2 desktop:w-full">SEE ALSO</div>
      <div class="flex hidden desktop:gap-10 gap-3 title text-base">
        <a href="#">SALES</a>
        <a href="#">PROMO</a>
      </div>
    </div>
    <div class="w-full flex desktop:border desktop:border-black mt-6">
      <div @click="router.push('/product')" class="cursor-pointer w-1/4 desktop:block aspect-square border-r border-black p-4 hidden">
        <div
            class="w-full mb-4 aspect-square bg-center bg-cover bg-no-repeat bg-[url('./assets/mainPage/new-furniture-knob.png')]"></div>
        <div class="w-full flex justify-between">
          <div>T-BAR / BRASS</div>
          <div>£55</div>
        </div>
      </div>
      <div @click="router.push('/product')" class="cursor-pointer w-full desktop:w-1/4 aspect-square border-y desktop:border-r desktop:border-y-0 border-black desktop:p-4 p-4 pl-0">
        <div
            class="w-full mb-4 aspect-square bg-center bg-cover bg-no-repeat bg-[url('./assets/mainPage/t-bar-black.png')]"></div>
        <div class="w-full flex justify-between">
          <div>FURNITURE KNOB</div>
          <div>£240</div>
        </div>
      </div>
      <div @click="router.push('/product')" class="cursor-pointer w-full desktop:w-1/4 aspect-square border-y border-l desktop:border-y-0 desktop:border-l-0 desktop:border-r border-black desktop:p-4 p-4 pr-0">
        <div
            class="w-full mb-4 aspect-square bg-center bg-cover bg-no-repeat bg-[url('./assets/mainPage/towel-rail.png')]"></div>
        <div class="w-full flex justify-between">
          <div>TOWEL RAIL</div>
          <div>£240</div>
        </div>
      </div>
      <div class="w-1/4 desktop:block hidden aspect-square border-black">
        <div
            class="text-white title text-base w-full h-full bg-center flex justify-center items-center bg-cover bg-no-repeat bg-[url('./assets/mainPage/98.png')]">+98</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
