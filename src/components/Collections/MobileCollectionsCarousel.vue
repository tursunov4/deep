<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import "swiper/css/pagination"
import {Navigation, FreeMode} from "swiper/modules";
import {ref} from "vue";
import {AppStore} from "../../store/AppStore.ts";
import {components} from "../../types/schema";
const App = AppStore()

const modules = [Navigation, FreeMode]
const swiperInstance = ref()

function onSwiper(swiper: any) {
  swiperInstance.value = swiper
}

defineProps<{
  collection ?: components["schemas"]["RetrieveCollection"]
}>()
</script>
<template>
  <swiper @swiper="onSwiper" :watchSlidesProgress="true" :slides-per-view="2.2" :modules="modules" :free-mode="true" :slides-per-group="1"
          class="subcategoriesSwiper pb-[20px] desktop:h-full">
    <swiper-slide v-for="category in collection?.categories" class="cursor-pointer w-full ">
        <RouterLink :to="{path:'/sub-category/' + category.eng_name, query: { collection: collection?.id}}" class="w-full h-full">
          <img :src="category.banner" class="aspect-[175/192] w-full object-cover"/>
          <div class="text-[18px] text-black mt-[20px] relative z-10 w-full">
            {{ App.language == 'ru' ? category.rus_name : category.eng_name }}
          </div>
        </RouterLink>
    </swiper-slide>
  </swiper>
  <!--  <swiper v-else @swiper="onSwiper" :modules="modules" :navigation="true" :free-mode="true" class="subcategoriesSwiper w-full">
      <swiper-slide v-for="product in products" class="cursor-pointer w-2/5 p-[20px] aspect-[7/8] border-b border-r border-black"
      >
        <ProductCard :product-group="product"/>
      </swiper-slide
      >
    </swiper>-->
</template>

<style>
  .subcategoriesSwiper .swiper-slide {
    display: flex;
  }

  .subcategoriesSwiper.swiper-initialized {
    border-bottom: black 1px solid;
    padding: 0 20px 20px 20px;
  }
  .subcategoriesSwiper .swiper-slide {
    display: flex;
  }

  .subcategoriesSwiper.swiper-initialized {
    overflow: visible !important;
  }

  .subcategoriesSwiper > .swiper-button-next, .subcategoriesSwiper > .swiper-button-prev {
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

  .subcategoriesSwiper .swiper-button-next:hover::after {
    content: "";
    width: 48%;
    height: 2px;
    background-color: #000000;
    position: absolute;
    animation: scroll-right 1.7s infinite cubic-bezier(.23,.92,.34,.91);
  }


  .subcategoriesSwiper .swiper-button-next::before {
    content: "";
    width: 100%;
    height: 2px;
    right: 0;
    background-color: #E0E0E0;
    position: absolute;
  }

  .subcategoriesSwiper .swiper-button-prev:hover::after {
    content: "";
    width: 40%;
    height: 2px;
    background-color: #000000;
    position: absolute;
    right: 0;
    animation: scroll-left 1.7s infinite cubic-bezier(.23,.92,.34,.91);
  }

  .subcategoriesSwiper .swiper-button-prev::before {
    content: "";
    width: 100%;
    height: 2px;
    background-color: #E0E0E0;
    position: absolute;
  }

  .subcategoriesSwiper .swiper-button-next {
    right: -30px;
    top: calc(50% - 40px);
  }

  .subcategoriesSwiper .swiper-button-prev {
    left: -30px;
    top: calc(50% - 40px);
  }

</style>
