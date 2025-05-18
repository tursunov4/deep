<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import "swiper/css/pagination"
import {Pagination} from 'swiper/modules';
const modules = [Pagination]
</script>

<template>
  <swiper :pagination="true" :modules="modules" class="mySwiper">
    <swiper-slide @click=""
    ><img class="w-full h-full"
          src="https://www.busterandpunch.com/wp-content/uploads/product/BP_Heavy_Metal_Gun_Metal_Crystal_Bulb_01_Square_Web-scaled.jpg"/></swiper-slide
    >
    <swiper-slide
    ><img class="w-full h-full object-cover"
          src="../../assets/accessories/t-bar.png"/></swiper-slide
    >
    <swiper-slide
    ><img class="w-full h-full"
          src="../../assets/accessories/shower-square.png"/></swiper-slide
    >
    <swiper-slide
    ><img class="my-auto"
          src="../../assets/accessories/knob.png"/></swiper-slide
    >
  </swiper>
</template>

<style scoped>

.swiper-slide{
  height:auto;
}

.swiper-wrapper{
  display: flex;
  align-items: stretch;
}

.swiper-wrapper{
  height: 100%;
}

.mySwiper{
  overflow: visible;
}

.swiper-pagination-bullet{
  background-color: white;
  border: solid 1px black;
  opacity: 1;
  width: 10px;
  height: 10px;
}

.swiper-pagination-bullet-active{
  background-color: black;
  border: solid 1px black;
}

.swiper-pagination{
  z-index: 99;
  margin-bottom: -25px;
}

</style>
