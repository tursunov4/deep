<script setup lang="ts">

import {components} from "../../types/schema";
import router from "../../router";
import {AppStore} from "../../store/AppStore.ts";
const App = AppStore()
const props = defineProps<{
  no_first?: boolean,
  sub_categories: components["schemas"]["Subcategories"][]
  collectionId: number
}>()

const offset = props.no_first ? 0 : 1

</script>

<template>
  <div @click="router.push({ path: '/sub-category/' + sub_categories[0].eng_name, query: { collection: collectionId } })" v-if="!no_first" class="relative cursor-pointer col-span-2 row-span-2 aspect-[1/1] p-4 flex items-end">
    <img :src="sub_categories[0].banner" class="h-full object-center bottom-0 left-0 -z-10 absolute w-full object-cover"/>
    <div class="title text-white">{{App.language == 'ru' ? sub_categories[0].rus_name : sub_categories[0].eng_name}}</div>
  </div>
  <div @click="router.push({ path: '/sub-category/' + sub_categories[0+offset].eng_name, query: { collection: collectionId } })" class="cursor-pointer relative col-span-2 row-span-2 aspect-[1/1] p-4 flex items-end">
    <img :src="sub_categories[0 + offset].banner" class="h-full object-center bottom-0 left-0 -z-10 absolute w-full object-cover"/>
    <div class="title text-white">{{ App.language == 'ru' ? sub_categories[0 + offset].rus_name : sub_categories[0 + offset].eng_name}}</div>
  </div>
</template>

<style scoped>

</style>
