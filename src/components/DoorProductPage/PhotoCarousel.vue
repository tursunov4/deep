<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';

import "swiper/css/free-mode"
import "swiper/css/thumbs"
import {Navigation, Thumbs, Pagination} from 'swiper/modules';
import {ref} from "vue";
import {components} from "../../types/schema";
import {useWindowWidth} from "../../composables/isDesktop.ts";

const modules = [Navigation, Thumbs, Pagination]

const selectedImage = ref(0)

let thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
}
const {isDesktop} = useWindowWidth()

defineProps<{
  images?: components["schemas"]["DoorImage"][]
}>()

</script>

<template>
  <div class="w-full h-full flex gap-[25px]">
    <div class="-mt-[4px] hidden desktop:block">
      <swiper
          @swiper="setThumbsSwiper"
          :loop="false"
          :slidesPerView="'auto'"
          :modules="[Thumbs]"
          :direction="'vertical'"
          class="photoSwiper relative first overflow-x-visible"
      >
        <swiper-slide v-for="(image, index) in images" @click="selectedImage = index"
        ><img :class="{'border-black border-[1px]' : selectedImage == index}"
              class="object-cover box-border min-h-[84px] p-[4px] cursor-pointer h-[84px] min-w-[74px] max-w-[74px] w-[74px] "
              :src="image?.crop_image ?? image.photo"/>
        </swiper-slide
        >
      </swiper>
    </div>
    <swiper
        :spaceBetween="isDesktop ? 10 : 0"
        :modules="modules"
        :direction="isDesktop ? 'vertical' : 'horizontal'"
        :thumbs="{ swiper: thumbsSwiper }"
        :pagination="{
      type: 'progressbar',
    }"
        class="w-full second desktop:aspect-square aspect-[103/75]"
    >
      <swiper-slide @click=""
                    v-for="image in images"
      >
        <div class="overflow-hidden w-full h-full"><img class="h-full w-full object-cover"
                                                        :src="image.photo"/>
        </div>
      </swiper-slide
      >
    </swiper>
  </div>
</template>

<style>

.second .swiper-pagination-progressbar {
  display: none;
}

@media (max-width: 1100px) {
  .second .swiper-pagination-progressbar.swiper-pagination-horizontal {
    display: inherit;
    width: 50%;
    top: auto;
    bottom: 30px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }

  .second .swiper-pagination-progressbar-fill {
    background: black !important;
  }

  .second .swiper-slide {
    height: auto;
  }

  .second .swiper-wrapper {
    display: flex;
    align-items: stretch;
  }

  .second .swiper-wrapper {
    height: 100%;
  }

  .mySwiper {
    overflow: visible;
  }

  .second .swiper-pagination-bullet {
    background-color: black;
    border: solid 1px black;
    opacity: 1;
    width: 10px;
    height: 10px;
  }

  .second .swiper-pagination-bullet-active {
    background-color: black;
    border: solid 1px black;
  }
}

/*.first .swiper-slide {
  margin: 0 !important;
}

:root {
  --swiper-navigation-top-offset: 50%;
  --swiper-navigation-sides-offset: 10px;
  --swiper-navigation-color: black;
}

.swiper-button-prev,
.swiper-button-next {
  rotate: 90deg;
  background-color: white;
  position: absolute;
  width: 102%;
  aspect-ratio: 1/1;
  z-index: 10;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--swiper-navigation-color, var(--swiper-theme-color));
}

.swiper-button-prev.swiper-button-disabled,
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
}

.swiper-navigation-disabled .swiper-button-prev,
.swiper-navigation-disabled .swiper-button-next {
  display: none !important;
}

.swiper-button-prev {
  top: 0;
}

.swiper-button-next {
  bottom: -1px;
}


.swiper-button-prev svg,
.swiper-button-next svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform-origin: center;
}

.swiper-rtl .swiper-button-prev svg,
.swiper-rtl .swiper-button-next svg {
  transform: rotate(180deg);
}

.swiper-button-lock {
  display: none;
}

!* Navigation font start *!
.swiper-button-prev:after,
.swiper-button-next:after {
  font-family: swiper-icons;
  font-size: 30px;
  text-transform: none !important;
  letter-spacing: 0;
  font-variant: initial;
  line-height: 1;
}

.swiper-button-prev:after,
.swiper-rtl .swiper-button-next:after {
  content: 'prev';
}

.swiper-button-next,
.swiper-rtl .swiper-button-prev {
  left: auto;
}

.swiper-button-next:after,
.swiper-rtl .swiper-button-prev:after {
  content: 'next';
}

.swiper-wrapper {
  gap: 4px;
}*/

</style>
