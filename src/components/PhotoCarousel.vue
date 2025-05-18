<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';

import "swiper/css/free-mode"
import "swiper/css/thumbs"
import {Navigation, Thumbs} from 'swiper/modules';
import {ref, watch, onUnmounted} from "vue";
import {components} from "../types/schema";
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: 'global'})
const modules = [Navigation, Thumbs]

const selectedImage = ref(0)

let thumbsSwiper = ref(null);
let zoomSwiper = ref(null)
let showZoom = ref(false)

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
  zoomSwiper.value = swiper
}

defineProps<{
  images: components["schemas"]["Image"][]
}>()
let scrollTop: number;
watch(showZoom, () => {
  if (showZoom.value) {
    let body = document.querySelector('body') as HTMLBodyElement | null
    let html = document.querySelector('html') as HTMLBodyElement | null
    if (body && html) {
      const b = document.body;
      b.classList.add('noscroll');
    }
  } else {
    let body = document.querySelector('body') as HTMLBodyElement | null
    let html = document.querySelector('html') as HTMLBodyElement | null
    if (body && html) {
      const b = document.body;
      b.classList.remove('noscroll');
      html.scrollTo(0, scrollTop);
    }
  }
})
onUnmounted(() => {
  let body = document.querySelector('body') as HTMLBodyElement | null
  let html = document.querySelector('html') as HTMLBodyElement | null
  if (body && html) {
    const b = document.body;
    b.classList.remove('noscroll');
    html.scrollTo(0, scrollTop);
  }
})

</script>

<template>
  <div v-if="showZoom" class="absolute z-20 w-full flex flex-col bg-white mt-[-220px] right-0">
    <div class="h-[100vh]">
      <div class="font-TT text-[1vw] font-bold flex justify-center items-center mt-[3vh]">
        <div class="mb-[3vh]">
          {{t('product_page.zoom').toUpperCase()}}
        </div>
        <div @click="showZoom=false" class="close absolute right-0 mt-[-3.7vh] mr-[3vh]"></div>
      </div>
      <div class="w-full h-[88vh]">
        <swiper
            :loop="true"
            :slidesPerView="'auto'"
            :modules="modules"
            :direction="'horizontal'"
            :navigation="true"
            :initial-slide="selectedImage"
            class="zoomSwiper w-full h-full relative first overflow-x-visible"
        >
          <swiper-slide v-for="image in images"
          ><img
                class="h-full aspect-[64/73] mx-auto"
                :src="image.photo"/>
          </swiper-slide
          >
        </swiper>
      </div>
    </div>
  </div>

  <div class="w-full h-full flex justify-between gap-[1.65vw] -ml-[5px]">
    <div class="-mt-[4px] overflow-x-visible">
      <swiper
          @swiper="setThumbsSwiper"
          :loop="false"
          :slidesPerView="'auto'"
          :modules="modules"
          :direction="'vertical'"
          :navigation="true"
          class="photoSwiper relative first overflow-x-visible"
      >
        <swiper-slide v-for="(image, index) in images" @click="selectedImage = index"
        ><img :class="{'border-black border-[1px]' : selectedImage == index}"
              class="object-cover box-border min-h-[84px] p-[4px] h-[84px] min-w-[74px] max-w-[74px] w-[74px] "
              :src="image.photo"/>
        </swiper-slide
        >
      </swiper>
    </div>
    <swiper
        :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }"
        :allowTouchMove="false"
        :modules="modules"
        :direction="'vertical'"
        space-between="10px"
        :loop="true"
        :thumbs="{ swiper: thumbsSwiper }"
        class="w-full aspect-[64/73] vertical"
    >
      <swiper-slide v-for="image in images"

      >
        <div @click="showZoom=true" class="overflow-hidden hover:cursor-crosshair w-full h-full"><img
            class="object-cover h-full w-full"
            :src="image.photo"/>
        </div>
      </swiper-slide
      >
    </swiper>
  </div>
</template>

<style>

.first .swiper-slide {
  margin: 0 !important;
}

.first .swiper-initialized {
  padding-top: -4px !important;
}

.first .swiper-wrapper {
  align-items: start;
}

:root {
  --swiper-navigation-top-offset: 50%;
  --swiper-navigation-sides-offset: 10px;
  --swiper-navigation-color: black;
}

.zoomSwiper > .swiper-button-next{
  right: 0;
}

.zoomSwiper > .swiper-button-prev,
.zoomSwiper > .swiper-button-next {
  position: absolute;
  width: 50px;
  height: 50px;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--swiper-navigation-color, var(--swiper-theme-color));
}

/*.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0.35;
  cursor: auto;
  pointer-events: none;
}

.swiper-button-prev.swiper-button-hidden,
.swiper-button-next.swiper-button-hidden {
  opacity: 0;
  cursor: auto;
  pointer-events: none;
}*/

.first .swiper-navigation-disabled .swiper-button-prev,
.swiper-navigation-disabled .swiper-button-next {
  display: none !important;
}

.zoomSwiper > .swiper-button-prev, .zoomSwiper > .swiper-button-next {
  top: calc(50% - 45px);
  z-index: 999;
}

.zoomSwiper > .swiper-button-prev svg,
.zoomSwiper > .swiper-button-next svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: center;
}

.zoomSwiper > .swiper-rtl .swiper-button-prev svg,
.zoomSwiper > .swiper-rtl .swiper-button-next svg {
  transform: rotate(180deg);
}

.first .swiper-button-lock {
  display: none;
}

/* Navigation font start */
.zoomSwiper > .swiper-button-prev:after,
.zoomSwiper > .swiper-button-next:after {
  font-family: swiper-icons;
  font-size: 30px;
  text-transform: none !important;
  letter-spacing: 0;
  font-variant: initial;
  line-height: 1;
}

.zoomSwiper > .swiper-button-prev:after,
.zoomSwiper > .swiper-rtl .swiper-button-next:after {
  content: 'prev';
}

.zoomSwiper > .swiper-button-next,
.zoomSwiper > .swiper-rtl .swiper-button-prev {
  left: auto;
}

.zoomSwiper > .swiper-button-next:after,
.zoomSwiper > .swiper-rtl .swiper-button-prev:after {
  content: 'next';
}

</style>
