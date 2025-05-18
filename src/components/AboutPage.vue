<script setup lang="ts">
  import createClient from "openapi-fetch";
  import {components, paths} from "../types/schema";
  import {onMounted, ref, Ref} from "vue";
  import AboutPageMobile from "./AboutPageMobile.vue";
  import AboutPageDesktop from "./AboutPageDesktop.vue";
  import {useWindowWidth} from "../composables/isDesktop.ts";

  const HOST = import.meta.env.VITE_HOST_NAME
  const {GET} = createClient<paths>({baseUrl: HOST});

  const categories: Ref<components["schemas"]["CountCategory"][] | undefined> = ref()

  async function fetchCategories(){
    const {data, error} = await GET("/api/categories/amount_of/", {})
    if (error) return
    categories.value = data as unknown as components["schemas"]["CountCategory"][]
  }

  onMounted(() => {
    fetchCategories()
  })

  const {isDesktop} = useWindowWidth()
</script>

<template>
  <AboutPageDesktop :categories="categories" v-if="isDesktop"/>
  <AboutPageMobile :categories="categories" v-else/>
</template>

<style scoped>

</style>
