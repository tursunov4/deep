<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import NewProducts from "../HomePage/NewProducts.vue";
import Map from "../Map.vue";
import AboutVideo from "../HomePage/AboutVideo.vue";
import createClient from "openapi-fetch";
import {components, paths} from "../../types/schema";
import {AppStore} from "../../store/AppStore.ts";
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: 'global'})
const App = AppStore()
const HOST = import.meta.env.VITE_HOST_NAME
const {GET} = createClient<paths>({baseUrl: HOST});
const collections: Ref<components["schemas"]["RetrieveCollection"][]> = ref([])

async function fetchCollections(){
  const {data, error} = await GET('/api/collections/list/', {})
  if (error) return
  collections.value = data

}

onMounted(() => {
  fetchCollections()
})

type Steps = 'grid' | 'list'
const step: Ref<Steps> = ref('grid')

</script>

<template>
  <div>

    <div class="flex flex-col px-6 items-end desktop:page-title-block desktop:mb-0 mb-[22.0513vw]">
      <div class="flex flex-col items-center gap-6 mx-auto my-auto mt-[140px] desktop:mt-[150px]">
        <h1 class="title desktop:text-[80px] text-5xl text-center">
          {{t('breadcrumbs.collections').toUpperCase()}}
        </h1>
        <div class="text-[18px] font-TT font-bold mt-[-27px] desktop:mt-[-17px] text-center">
          {{collections.length == 0 ? '' : collections.length}}
        </div>
      </div>
    </div>

    <div class="w-full desktop:flex grid grid-cols-2 px-[19px] desktop:px-[29px] desktop:h-[3.75vw] h-[10.2564vw] font-TT font-bold text-[3.5897vw] desktop:text-[0.8750vw] mb-[7.6923vw] desktop:mb-[1.8750vw]">
      <div class="h-full border border-black flex flex-col items-center py-[2.5641vw] desktop:py-[1.3vw] desktop:w-[12.0625vw]" @click="step='grid'" :class="{'bg-black text-white': step=='grid'}">
        {{t('collection.grid_view').toUpperCase()}}
      </div>
      <div class="h-full border border-black flex flex-col items-center py-[2.5641vw] desktop:py-[1.3vw] desktop:w-[12.0625vw]" @click="step='list'" :class="{'bg-black text-white': step=='list'}">
        {{t('collection.list_view').toUpperCase()}}
      </div>
    </div>

    <!--Сетка с коллекциями-->
    <!--Проверяем, есть ли коллекции-->

    <div v-if="collections">
    <div v-if="step=='grid'" class="w-full desktop:grid flex-col grid-cols-2 desktop:px-[29px] px-[19px]">
      <!--Отрисовываем коллекции в виде сетки-->
      <div v-for="collection in collections" class="relative">
        <img :src="collection.banner" class="desktop:h-[27.5000vw] h-[55.5385vw] object-center w-full object-cover"/>
        <div class="title text-white absolute desktop:left-[1.8750vw] desktop:bottom-[2.0625vw] font-TT font-bold desktop:text-[2.5vw] text-[10.2564vw] desktop:leading-[2.5vw] text-[10.2564vw ] left-[5.1282vw] bottom-[5.2821vw]">
          {{App.language == 'ru' ? collection.rus_name : collection.eng_name}}
        </div>
      </div>
    </div>
    <div v-else class="w-full font-TT font-bold text-[10.2564vw] desktop:text-[5vw] desktop:leading-[5vw] leading-[10.2564vw] px-[19px] desktop:px-[29px]">
      <div v-for="collection in collections">
        {{App.language == 'ru' ? collection.rus_name : collection.eng_name}}
      </div>
    </div>
    </div>
    <!--Если коллекций нету, то выводим coming soon-->
    <div v-else>
      <div class="w-full text-center font-TT font-bold desktop:text-[1.25vw] desktop:leading-[1.25vw] py-[1.25vw]">
        {{t('collections.coming_soon').toUpperCase()}}
      </div>
    </div>

    <NewProducts />
    <div class="w-full flex">
      <div class="desktop:w-1/2 w-full z-[0] aspect-[4/3]">
        <Map/>
      </div>
      <div class="w-1/2 hidden desktop:block aspect-[4/3]">
        <AboutVideo/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
