<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import "swiper/css/pagination"
import {Navigation, FreeMode} from "swiper/modules";
import {ref, onMounted} from "vue";
import {components} from "../../types/schema";
import createClient from "openapi-fetch";
import {paths} from "../../types/schema";
import {AppStore} from "../../store/AppStore.ts";
import router from "../../router";
import {useWindowWidth} from "../../composables/isDesktop.ts";

const App = AppStore()
const HOST = import.meta.env.VITE_HOST_NAME
const {GET} = createClient<paths>({baseUrl: HOST});

const modules = [Navigation, FreeMode]
const swiperInstance = ref()

const doors = ref<components["schemas"]["PreviewDoor"][]>([])

function onSwiper(swiper: any) {
  swiperInstance.value = swiper
}

async function fetchDoors() {
  const {data, error} = await GET('/api/doors/', {})
  if (error || !data) return
  doors.value = data
}
onMounted(fetchDoors)
const {isDesktop} = useWindowWidth()
</script>
<template>
  <swiper @swiper="onSwiper" :watchSlidesProgress="true" :slides-per-view="isDesktop ? 2 : 1" :modules="modules"
          :navigation="true" :free-mode="!isDesktop" :slides-per-group="isDesktop ? 2 : 1"
          class="doorsSwiper desktop:h-full">
    <swiper-slide @click="router.push('/door/' + door.id)" v-for="door in doors" class="cursor-pointer desktop:w-full desktop:aspect-[740/424]">
      <div class="w-full aspect-[350/192] relative h-full">
        <img class="absolute w-full h-full z-0 top-0 left-0 object-cover"
             :src="door.main_photo.crop_image ?? door.main_photo.photo"/>
        <div
            class="absolute overflow-hidden text-white font-TT text-[40px] uppercase font-bold px-[40px] py-[17px] desktop:flex hidden items-end top-0 left-0 w-full z-10 h-full bg-black-general/40">
          {{ App.language == 'ru' ? door.rus_name : door.eng_name }}
        </div>
      </div>
      <div class="desktop:hidden mt-[15px] uppercase text-black font-TT text-[18px] tracking-[0.4px] font-bold">
      {{ App.language == 'ru' ? door.rus_name : door.eng_name }}
      </div>
    </swiper-slide>
  </swiper>
  <!--  <swiper v-else @swiper="onSwiper" :modules="modules" :navigation="true" :free-mode="true" class="productSwiper w-full">
      <swiper-slide v-for="product in products" class="cursor-pointer w-2/5 p-[20px] aspect-[7/8] border-b border-r border-black"
      >
        <ProductCard :product-group="product"/>
      </swiper-slide
      >
    </swiper>-->
</template>

<style>
@media (max-width: 1100px) {
.doorsSwiper.swiper-initialized {
  padding: 0 20px;
}}

@media (min-width: 1100px) {

  .doorsSwiper .swiper-slide {
    display: flex;
  }

  .doorsSwiper.swiper-initialized {
    margin: 0 60px !important;
    overflow: visible !important;
  }

  .doorsSwiper > .swiper-button-next, .doorsSwiper > .swiper-button-prev {
    cursor: pointer;
    overflow: hidden;
    margin-bottom: auto;
    position: absolute;
    width: 60px;
    background-color: #ffffff;
    height: 80px;
    display: flex;
    align-items: center;
    z-index: 99;
  }

  .doorsSwiper .swiper-button-next:hover::after {
    content: "";
    width: 48%;
    height: 2px;
    background-color: #000000;
    position: absolute;
    animation: scroll-right 1.7s infinite cubic-bezier(.23, .92, .34, .91);
  }


  .doorsSwiper .swiper-button-next::before {
    content: "";
    width: 100%;
    height: 2px;
    right: 0;
    background-color: #E0E0E0;
    position: absolute;
  }

  .doorsSwiper .swiper-button-prev:hover::after {
    content: "";
    width: 48%;
    height: 2px;
    background-color: #000000;
    position: absolute;
    right: 0;
    animation: scroll-left 1.7s infinite cubic-bezier(.23, .92, .34, .91);
  }

  .doorsSwiper .swiper-button-prev::before {
    content: "";
    width: 100%;
    height: 2px;
    background-color: #E0E0E0;
    position: absolute;
  }

  .doorsSwiper .swiper-button-next {
    right: -60px;
    height: 100%;
    top: 0px;
  }

  .doorsSwiper .swiper-button-prev {
    left: -60px;
    height: 100%;
    top: 0px;
  }

  .doorsSwiper .swiper-button-disabled {
    opacity: 0;
  }
}

</style>
