<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import "swiper/css/pagination"
import {Pagination} from "swiper/modules";
import {ref} from "vue";
import {components, paths} from "../../types/schema";
import createClient from "openapi-fetch";
import {AppStore} from "../../store/AppStore.ts";
const HOST = import.meta.env.VITE_HOST_NAME
const {GET} = createClient<paths>({baseUrl: HOST});
const modules = [Pagination]
const swiperInstance = ref()
const App = AppStore()
function onSwiper(swiper: any) {
  swiperInstance.value = swiper
  swiperInstance.value?.slideTo(0)
}

const doors = ref<components["schemas"]["DoorCombinations"][] | null>([])
async function fetchDoors() {
  const {data, error} = await GET('/api/door-page/doors_combinations/', {})
  if (error || !data) return
  doors.value = data
}

fetchDoors()

</script>

<template>
  <swiper v-if="doors?.length" @swiper="onSwiper" :pagination="{clickable: true}" :navigation="true" :modules="modules" :loop="true" class="combinationsSwiper h-full">
    <swiper-slide v-for="door in doors"  @click="() => {swiperInstance.slideNext()}"
    >
      <div class="w-full h-full desktop:flex desktop:px-[30px]">
        <img :src="door.banner"
             class="desktop:w-1/2 w-full desktop:border-y border-black desktop:h-full h-[420px] object-cover">
        <div class="desktop:w-1/2 w-full">
          <div
              class="desktop:w-full h-full border-t border-l desktop:border-l-0 m-[20px] desktop:m-0 flex flex-wrap border-black">
            <div class="w-1/2 aspect-[385/465] flex flex-col border-r border-b border-black desktop:p-[30px] p-[20px] pb-[10px]">
              <div class="h-[90%] bg-[#EDEDED] desktop:p-8 p-[15px]">
                <img :src="door.image_left_up" class="h-full block m-auto">
              </div>
              <div class="desktop:text-sm text-[6px] desktop:mt-[18px] flex justify-between uppercase mt-1"><div>{{ App.language == 'ru' ? door.name_left_up_ru : door.name_left_up_eng  }}</div><div>{{ App.language == 'ru' ? door.cost_rub_left_up : door.cost_eur_left_up }}</div></div>
            </div>
            <div class="w-1/2 aspect-[385/465] flex flex-col border-r border-b border-black desktop:p-[30px] p-[20px] pb-[10px]">
              <div class="h-[90%] bg-[#EDEDED] desktop:p-8 p-[15px]">
                <img :src="door.image_right_up" class="h-full block m-auto">
              </div>
              <div class="desktop:text-sm text-[6px] desktop:mt-[18px] flex justify-between uppercase mt-1"><div>{{ App.language == 'ru' ? door.name_right_up_ru : door.name_right_up_eng  }}</div><div>{{ App.language == 'ru' ? door.cost_rub_right_up : door.cost_eur_right_up }}</div></div>
            </div>
            <div class="w-1/2 aspect-[385/465] flex flex-col border-r border-b border-black desktop:p-[30px] p-[20px] pb-[10px]">
              <div class="h-[90%] bg-[#EDEDED] desktop:p-8 p-[15px]">
                <img :src="door.image_left_down" class="h-full block m-auto">
              </div>
              <div class="desktop:text-sm text-[6px] desktop:mt-[18px] flex justify-between uppercase mt-1"><div>{{ App.language == 'ru' ? door.name_left_down_ru : door.name_left_down_eng  }}</div><div>{{ App.language == 'ru' ? door.cost_rub_left_down : door.cost_eur_left_down }}</div></div>
            </div>
            <div class="w-1/2 aspect-[385/465] flex flex-col border-r border-b border-black desktop:p-[30px] p-[20px] pb-[10px]">
              <div class="h-[90%] bg-[#EDEDED] desktop:p-8 p-[15px]">
                <img :src="door.image_right_down" class="h-full block m-auto">
              </div>
              <div class="desktop:text-sm text-[6px] desktop:mt-[18px] flex justify-between uppercase mt-1"><div>{{ App.language == 'ru' ? door.name_right_down_ru : door.name_right_down_eng  }}</div><div>{{ App.language == 'ru' ? door.cost_rub_right_down : door.cost_eur_right_down }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>

<style>

.combinationsSwiper.swiper-initialized{
  overflow: visible;
}

.combinationsSwiper  {
  overflow: visible;
}

.combinationsSwiper .swiper-pagination{
  bottom: -32px;
}

.combinationsSwiper .swiper-pagination-bullet {
  background-color: #D7D7D7FF;
  border-radius: 0;
  width: 60px;
  opacity: 1;
  height: 2px;
}

.combinationsSwiper .swiper-pagination-bullet-active {
  background-color: black;
}

@media (max-width: 1100px) {
  .combinationsSwiper .swiper-wrapper {
    padding-bottom: 40px;
  }
  .combinationsSwiper .swiper-pagination{
    bottom: 35px;
  }
}
</style>
