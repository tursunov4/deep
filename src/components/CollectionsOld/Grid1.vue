<script setup lang="ts">
import router from "../../router";
import {components} from "../../types/schema";
import {AppStore} from "../../store/AppStore.ts";

const App = AppStore()

defineProps<{
  sub_categories: components["schemas"]["Subcategories"][]
  collectionId: number
}>()

</script>

<template>
  <div @click="router.push({ path: '/sub-category/' + sub_categories[0].eng_name, query: { collection: collectionId } })" class="cursos pointer col-span-4 aspect-[3/1] desktop:aspect-[4/1] p-4 flex items-end relative">
    <img :src="sub_categories[0].banner" class="h-full object-center bottom-0 left-0 -z-10 absolute w-full object-cover"/>
    <div class="title text-white">{{ App.language == 'ru' ? sub_categories[0].rus_name : sub_categories[0].eng_name }}</div>
  </div>
</template>

<style scoped>

</style>
