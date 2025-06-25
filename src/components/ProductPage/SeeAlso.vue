<script setup lang="ts">
import { components } from "../../types/schema";
import { useI18n } from "vue-i18n";
import ProductScroller from "../ProductScroller.vue";
import router from "../../router";
const { t } = useI18n({ useScope: "global" });

defineProps<{
  seeAlso: components["schemas"]["ObjsCollection"];
  subcategory: string;
}>();
</script>

<template>
  <div class="w-full block-gap">
    <div class="flex main-p-sides justify-between">
      <div
        class="title text-[32px] desktop:text-[40px] leading-10 w-1/3 desktop:w-auto"
      >
        {{ t("product_page.see_also") }}
      </div>
      <div
        @click="
          router.push({
            path: '/sub-category/' + subcategory,
            query: { sale: 'true' },
          })
        "
        class="font-TT cursor-pointer font-bold tracking-[0.56px]"
      >
        {{ t("product_page.sales").toUpperCase() }}
      </div>
    </div>
    <div class="desktop:mt-6 mt-[4px]">
      <ProductScroller
        :collection="seeAlso"
        :products="[...seeAlso.products]"
      />
    </div>
  </div>
</template>

<style scoped></style>
