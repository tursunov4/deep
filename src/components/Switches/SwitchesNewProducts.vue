<script setup lang="ts">
import createClient from "openapi-fetch";
import { components, paths } from "../../types/schema";
import { onMounted, ref, Ref } from "vue";

import ProductScroller from "../ProductScroller.vue";

const HOST = import.meta.env.VITE_HOST_NAME;

const { GET } = createClient<paths>({ baseUrl: HOST });

const products: Ref<components["schemas"]["PreviewAbstract"][]> = ref([]);
const amount = ref(0);
async function fetchProducts() {
  const { data, error } = await GET("/api/product/new_products/", {});
  if (error) return;
  products.value = data;
}
async function fetchAmount() {
  const { data, error } = await GET("/api/product/amount_of_products/", {});
  if (error) return;
  amount.value = data;
}

onMounted(() => {
  fetchProducts();
  fetchAmount();
});
</script>

<template>
  <div class="w-full block-gap">
    <div class="flex main-p-sides justify-between">
      <div class="title uppercase text-[40px] leading-10 w-1/3 desktop:w-auto">
        новые продукты
      </div>
    </div>
    <div class="desktop:mt-6 mt-[4px]">
      <ProductScroller :products="products" />
    </div>
  </div>
</template>

<style scoped></style>
