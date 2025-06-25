<script setup lang="ts">
import { components } from "../types/schema";
import { useI18n } from "vue-i18n";
import ProductScroller from "./ProductScroller.vue";
const { t } = useI18n({ useScope: "global" });
defineProps<{
  related: components["schemas"]["PreviewAbstract"][];
}>();
</script>

<template>
  <div class="w-full mt-[10px]">
    <div class="flex main-p-sides justify-between">
      <div class="title text-[40px] leading-10 w-1/3 desktop:w-auto">
        {{ t("product_page.related_products") }}
      </div>
    </div>
    <div class="desktop:mt-6 mt-[4px]">
      <ProductScroller :products="related" />
    </div>
  </div>
</template>

<style scoped></style>
