<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { components } from "../types/schema";
const modules = [Pagination];
defineProps<{
  images: components["schemas"]["Image"][];
}>();
</script>

<template>
  <swiper
    id="mySwiper"
    :pagination="{
      type: 'progressbar',
    }"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="image in images" @click=""
      ><img class="w-full h-full object-cover" :src="image.photo" />
    </swiper-slide>
  </swiper>
</template>

<style>
:root {
  --swiper-pagination-bottom: 0px;
  --swiper-theme-color: #000000;
  --swiper-pagination-progressbar-bg-color: #ffffff;
  --swiper-pagination-progressbar-size: 2px;
}

.mySwiper .swiper-pagination-progressbar.swiper-pagination-horizontal {
  width: 50%;
  top: auto;
  bottom: 30px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.mySwiper .swiper-slide {
  position: relative;
  width: 100%;
  height: auto;
}

.mySwiper .swiper-slide::before {
  content: "";
  display: block;
  padding-top: calc(100% * (480 / 410));
}

.mySwiper .swiper-slide > * {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.mySwiper .swiper-wrapper {
  display: flex;
  align-items: stretch;
}

.mySwiper .swiper-wrapper {
  height: 100%;
}

.mySwiper {
  overflow: visible;
}

.mySwiper .swiper-pagination-bullet {
  background-color: white;
  border: solid 1px black;
  opacity: 1;
  width: 10px;
  height: 10px;
}

.mySwiper .swiper-pagination-bullet-active {
  background-color: black;
  border: solid 1px black;
}
</style>
