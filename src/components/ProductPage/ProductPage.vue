<script setup lang="ts">
import {ref, onMounted, Ref, watch} from "vue";

import ProductPageDesktop from "./ProductPageDesktop.vue";
import ProductPageMobile from "./ProductPageMobile.vue";
import createClient from "openapi-fetch";
import {components, paths} from "../../types/schema";
import router from "../../router";
import {useWindowWidth} from "../../composables/isDesktop.ts";
const HOST = import.meta.env.VITE_HOST_NAME
const {GET} = createClient<paths>({baseUrl: HOST});

const product: Ref<components["schemas"]["AbstractProduct"] | undefined> = ref()
const seeAlso: Ref<components["schemas"]["ObjsCollection"] | undefined> = ref()
const related: Ref<components["schemas"]["PreviewAbstract"][] | undefined> = ref()
const collections: Ref<components["schemas"]["CountCollection"][] | undefined> = ref()
const colors: Ref<components["schemas"]["CountCollection"][] | undefined> = ref()
const componentKey = ref(0);
const componentKeyMobile = ref(0);

async function fetchProduct(){
  const {data, error} = await GET("/api/product/{id}/", {params:{
      path:{
        id: parseInt(router.currentRoute.value.params.id as string)
      }
    }})
  if (error) return
  product.value = data
}

async function fetchSeeAlso(){
  const {data, error} = await GET("/api/product/{id}/same_collection/", {params:{
      path:{
        id: parseInt(router.currentRoute.value.params.id[0])
      }
    }})
  if (error) return
  seeAlso.value = data
}

async function fetchRelated(){
  const {data, error} = await GET("/api/product/{id}/related_objs/", {params:{
      path:{
        id: parseInt(router.currentRoute.value.params.id[0])
      }
    }})
  if (error) return
  related.value = data
}

async function fetchCollection(){
  const {data, error} = await GET("/api/collections/amount_of/")
  if (error) return
  //@ts-ignore
  collections.value = data
}

async function fetchColors(){
  const {data, error} = await GET("/api/product/count_colours/")
  if (error) return
  colors.value = data
}

const forceRerender = () => {
  componentKey.value += 1;
  componentKeyMobile.value += 1
};

watch(() => router.currentRoute.value, () => {
  fetchProduct()
  fetchSeeAlso()
  fetchRelated()
  fetchColors()
  forceRerender()
}, {immediate: true})

onMounted(fetchCollection)
const {isDesktop} = useWindowWidth()
</script>

<template>
  <Component :is="isDesktop ? ProductPageDesktop : ProductPageMobile" v-if="product" :colors="colors" :collections="collections" :related-products="related" :product-group="product" :see-also-products="seeAlso"/>
</template>

<style scoped>

</style>
