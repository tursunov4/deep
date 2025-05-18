<script setup lang="ts">
import AboutVideo from "./HomePage/AboutVideo.vue";
import Map from "./Map.vue";
import {useI18n} from "vue-i18n";
import {components} from "../types/schema";
import {AppStore} from "../store/AppStore.ts";
import router from "../router";

defineProps<{
  categories: components["schemas"]["CountCategory"][] | undefined
}>()

const App = AppStore()
const { t } = useI18n({ useScope: 'global' })


</script>


<template>
  <div>
    <div class="flex flex-col px-6">
    </div>
    <div class="flex gap-8 desktop:gap-0 desktop:flex-row flex-col p-4 mt-[12vw] mb-[23px] ml-[11px]">
      <div class="desktop:w-1/2 whitespace-pre-wrap title text-[40px] leading-[1]">
        {{t('about.title_1')}}
      </div>
      <div class="desktop:w-1/2 font-TT uppercase text-[40px] text-[#8B8B8B] leading-[1] pl-[22px] pr-[30px]">
        <div class="whitespace-pre-wrap">
          {{t('about.title_2')}}
        </div>
      </div>
    </div>

    <div id="video" class="w-full aspect-video">
      <AboutVideo :showreel="false" :about="false"/>
    </div>


    <div class="w-full">
    </div>
    <div class="flex mt-[80px] mb-[-23px] ml-[27px] mr-[10px]">
      <div class="desktop:w-1/2 whitespace-pre-wrap title text-[40px] leading-[1]">
        {{t('about.title_3')}}
      </div>
      <div class="desktop:w-1/2 font-TT uppercase text-[40px] text-[#8B8B8B] leading-[1]">
        <div class="pl-[19px] pr-[30px] pb-[30px] whitespace-pre-wrap">
          {{t('about.description_1')}}
        </div>
        <div class="pl-[19px] pr-[30px] pb-[30px] whitespace-pre-wrap">
          {{t('about.description_2')}}
        </div>
        <div class="pl-[19px] pr-[30px] pb-[30px] whitespace-pre-wrap">
          {{t('about.description_3')}}
        </div>
        <div class="pl-[19px] pr-[30px] whitespace-pre-wrap">
          {{t('about.description_4')}}
        </div>
      </div>
    </div>

    <!--    Начало блока-->
    <div class="w-full flex debug_border mt-[94px]">
      <!--    Левая часть    -->
      <div class="w-1/2 debug_border aspect-[740/420] pl-[30px] border-r border-black">
        <div class="w-full h-full debug_border pb-[30px] pr-[30px] border-b border-black">
          <div class="w-full h-full bg-cover bg-center bg-no-repeat bg-[url('./assets/ProductPage/depp_inspire.png')] flex items-center justify-center relative">
            <div class="text-white font-TT text-[40px] font-bold absolute top-[26px] left-[30px]">{{t('about.inspiration')}}</div>
          </div>
        </div>
      </div>
      <!--    Правая часть    -->
      <div class="w-1/2 debug_border aspect-[740/420] pr-[30px]">
        <div class="w-full h-full debug_border pb-[30px] pl-[30px] border-b border-black ">
          <div class="w-full h-full bg-cover bg-center bg-no-repeat bg-[url('./assets/ProductPage/create.png')] flex items-center justify-center relative">
            <div class="text-white font-TT text-[40px] font-bold absolute top-[26px] left-[30px]">{{t('about.create')}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex">
      <div class="w-1/2 pl-[30px] pt-[30px]">
        <div class="w-[35%] font-TT text-[40px] font-bold leading-[1] whitespace-pre-wrap">
          {{t('about.colors_title')}}
        </div>
      </div>
      <div class="w-1/2 flex">
        <div class="w-1/2 border-r border-black font-TT text-[40px] text-[#8B8B8B] leading-[1] pt-[30px] pl-[30px] whitespace-pre-wrap">
          {{t('about.colors_title_2')}}
        </div>
        <div class="w-1/2 pt-[30px]">
          <div class="border-b border-black mr-[30px]">
            <div class="font-TT text-[12px] text-[#8B8B8B] mb-[24px] pl-[30px]">
              {{t('about.market_by_colors')}}
            </div>
            <template v-for="category in categories">
            <div @click="router.push('/category/' + category.eng_name); $emit('hide')"
                  v-if="category.product_counter" class="font-TT uppercase text-[18px] font-bold mt-[-4px] pl-[30px] justify-between flex cursor-pointer">
              <div>{{App.language == 'ru' ? category.rus_name : category.eng_name}}</div>
              <div class="font-TT text-[18px] font-bold mt-[-4px]">
                {{ category.product_counter }}
              </div>
            </div>
            </template>
            <div class="font-TT text-[18px] font-bold mt-[-4px] pl-[30px] justify-between flex">
              <div class="font-TT text-[18px] font-bold">
                {{t('breadcrumbs.doors')}}
              </div>
              <div class="font-TT text-[18px] font-bold mt-[-4px]">
                4
              </div>
            </div>
            <div class="h-[33px]">
            </div>
          </div>
          <!--    PDF     -->
          <div class="flex">
            <a href="https://depp-d.com/media/catalog/catalog.pdf" target="_blank">
            <div class="pl-[30px] mb-[60px]">
              <div class="w-[60px] aspect-square border border-black p-[11px] mt-[30px]">
                <div class="w-full h-full bg-contain bg-center bg-no-repeat bg-[url('./assets/PDF.png')]"/>
              </div>
            </div>
            </a>
            <div>
              <div class="mt-[30px] font-TT text-[18px] font-bold whitespace-pre-wrap leading-[1.2] pl-[21px]">
                {{t('DEPP\nCOLLECTION')}}
              </div>
              <div class="pl-[21px] pt-[4px] font-TT text-[12px]">
                PDF
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="desktop:my-6 p-4">
    </div>
    <div class="w-full h-[90vh]">
      <Map/>
    </div>
  </div>
</template>

<style scoped>
  .debug_border {

  }
</style>
