<script setup lang="ts">
import {Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import "swiper/css/pagination"
import {Pagination} from "swiper/modules";
import {ref, watch} from "vue";
import {components} from "../../types/schema";
const modules = [Pagination]
const swiperInstance = ref()

defineProps<{
  images: components["schemas"]["DoorPageCoverImage"][]
}>()

function onSwiper(swiper: any) {
  swiperInstance.value = swiper
}
watch(swiperInstance, (newVal) => {
  if (newVal){
    console.log('slide')
  }
})
</script>

<template>
  <swiper @swiper="onSwiper" :pagination="{clickable: true}" :modules="modules" :slides-per-view="1" :loop="true" class="mainDoorsSwiper h-full">
    <swiper-slide v-for="image in images" @click="() => {swiperInstance.slideNext()}"
    ><img  class="w-full h-full object-cover"
          :src="image.photo"/></swiper-slide
    >
  </swiper>
</template>

<style>
.mainDoorsSwiper.swiper-initialized{
  overflow: visible;
}

.mainDoorsSwiper .mySwiper{
  overflow: visible;
}

.mainDoorsSwiper .swiper-pagination-bullet{
  background-color: #D7D7D7FF;
  border-radius: 0;
  width: 60px;
  opacity: 1;
  height: 2px;
}

.mainDoorsSwiper .swiper-pagination{
  bottom: -25px;
}

.mainDoorsSwiper .swiper-pagination-bullet-active{
  background-color: black;
  color: black;
}

@media (max-width: 1100px) {
  .mainDoorsSwiper .swiper-pagination{
    bottom: -15px;
  }

}

</style>
