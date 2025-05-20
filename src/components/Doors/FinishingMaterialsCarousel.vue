<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, FreeMode } from "swiper/modules";
import { ref } from "vue";
import { components, paths } from "../../types/schema";
import { AppStore } from "../../store/AppStore.ts";
import createClient from "openapi-fetch";
import { useI18n } from "vue-i18n";
import { useWindowWidth } from "../../composables/isDesktop.ts";
import { openPdf } from "../../composables/openPdf.ts";
const { t } = useI18n({ useScope: "global" });

const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });
const App = AppStore();

const modules = [Navigation, FreeMode];
const swiperInstance = ref();

function onSwiper(swiper: any) {
  swiperInstance.value = swiper;
}

let covers = ref<components["schemas"]["Cover"][]>([]);

async function fetchCovers() {
  const { data, error } = await GET("/api/door-page/covers/", {});
  if (error || !data) return;
  covers.value = data;
}

fetchCovers();

const { isDesktop } = useWindowWidth();
</script>
<template>
  <div
    class="mt-[80px] uppercase desktop:mb-[30px] desktop:mx-[30px] mx-[20px] leading-10 mb-[15px] pr-[45px] font-TT font-bold desktop:text-[40px] text-[32px]"
  >
    {{ t("doors_page.finishing_materials") }}
  </div>
  <swiper
    @swiper="onSwiper"
    :watchSlidesProgress="true"
    :slides-per-view="isDesktop ? 4 : 2.2"
    :modules="modules"
    :navigation="true"
    :free-mode="!isDesktop"
    :slides-per-group="isDesktop ? 4 : 1"
    class="coversSwiper desktop-buttons"
  >
    <swiper-slide
      v-for="(cover, index) in covers"
      @click="openPdf(App.language == 'ru' ? cover?.pdf_ru : cover?.pdf_eng)"
      :class="[
        index === 0 ? '' : 'border-l-transparent desktop:border-l-transparent',
      ]"
      class="w-full cursor-pointer border border-black flex flex-col desktop:p-[30px] p-[20px]"
    >
      <img :src="cover?.image" class="w-full aspect-[137/145]" />
      <div
        class="desktop:text-sm h-[16px] text-xs uppercase desktop:mt-2 mt-[20px]"
      >
        {{ App.language == "ru" ? cover?.rus_name : cover?.eng_name }}
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
.coversSwiper .swiper-slide {
  display: flex;
}

.coversSwiper .swiper-slide.swiper-slide-visible {
  opacity: 100;
}

.coversSwiper.swiper-initialized {
  border-top: 0px solid black;
}
</style>
