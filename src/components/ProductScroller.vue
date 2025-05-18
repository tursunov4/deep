<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import "swiper/css/pagination"
import {Navigation, FreeMode} from "swiper/modules";
import {ref} from "vue";
import {components} from "../types/schema";
import ProductCard from "./ProductCard.vue";
import {AppStore} from "../store/AppStore.ts";
import {useWindowWidth} from "../composables/isDesktop.ts";
import InspirationProductCard from "./InspirationProductCard.vue";
const App = AppStore()

const modules = [Navigation, FreeMode]
const swiperInstance = ref()

function onSwiper(swiper: any) {
  swiperInstance.value = swiper
}

function isPreviewAbstract(group: any): group is components["schemas"]["PreviewAbstract"] {
  return 'rus_name' in group && 'eng_name' in group && 'colored_products' in group;
}

function isSupportProduct(group: any): group is components["schemas"]["SupportProductForInspiration"] {
  return 'product' in group;
}

defineProps<{
  products: components["schemas"]["PreviewAbstract"][] | components["schemas"]["ProductInInspiration"][] | components["schemas"]["SupportProductForInspiration"][]
  collection ?: components["schemas"]["ObjsCollection"]
}>()
const {isDesktop} = useWindowWidth()
</script>
<template>
  <swiper @swiper="onSwiper" :watchSlidesProgress="true" :slides-per-view="isDesktop ? 'auto' : 2.2" :modules="modules" :navigation="true" :free-mode="!isDesktop" :slides-per-group="isDesktop ? 4 : 1"
          class="productSwiper h-[57vw] desktop-buttons desktop:h-full">
    <swiper-slide v-if="collection && isDesktop"
                  class="!w-2/4 aspect-[7/4]">
      <div
          class="w-full h-full text-white bg-center relative bg-cover darker flex flex-col p-4">
        <h1 class="title mx-auto my-auto">{{ App.language == 'ru' ? collection.rus_name : collection.eng_name }}</h1>
        <img :src="collection.banner" class="h-full object-center bottom-0 left-0 -z-10 absolute w-full object-cover"/>
        <div class="place-self-start">{{
            App.language == 'ru' ? collection.rus_title : collection.eng_title
          }}
        </div>
      </div>
    </swiper-slide>
    <swiper-slide v-for="(product, index) in products" :class="[index === 0 ? '' : 'border-l-transparent desktop:border-l-transparent']"   class="cursor-pointer border desktop:mr-0 desktop:p-[30px] p-[20px] w-full desktop:!w-1/4 aspect-[7/8] border-black">
      <ProductCard v-if="isPreviewAbstract(product)" :product-group="product"/>
      <ProductCard :product-group="product.product" v-else-if="isSupportProduct(product)"/>
      <InspirationProductCard :product-group="product" v-else-if="product.abstract_product_preview"/>
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
.productSwiper .swiper-slide {
  display: flex;
}

.productSwiper.swiper-initialized {
  border-top: 0px solid black;
}

@media (min-width: 1100px) {
  .productSwiper .swiper-slide {
    display: flex;
  }
}

</style>
