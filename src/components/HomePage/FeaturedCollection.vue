<script setup lang="ts">
import createClient from "openapi-fetch";
import { components, paths } from "../../types/schema";
import { onMounted, ref, Ref } from "vue";
import ProductCard from "../ProductCard.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });

const collection: Ref<components["schemas"]["ObjsCollection"] | undefined> =
  ref();

async function fetchMain() {
  const { data, error } = await GET("/api/collections/featured/", {});
  if (error) return;
  collection.value = data;
}

onMounted(() => {
  fetchMain();
});
</script>

<template>
  <div v-if="collection" class="w-full block-gap main-p-sides">
    <div class="flex mb-[30px]">
      <div class="flex items-center w-1/2">
        <div class="title hidden desktop:block uppercase text-[40px]">
          {{ t("featured_collection.featured_collection") }}
        </div>
      </div>
      <div class="w-1/2 flex justify-end items-end gap-4 text-black text-base">
        <RouterLink to="/collections">
          <a class="title text-base">{{
            t("featured_collection.all_collections")
          }}</a></RouterLink
        >
        <!--        <a @click="router.push('/collections')" class="title cursor-pointer text-base">{{t('featured_collection.all_collections')}}</a>-->
      </div>
    </div>
    <div
      class="w-full flex desktop:flex-row flex-col border-black desktop:border-r"
    >
      <div
        class="relative desktop:w-1/2 w-full main-p gap-4 text-white flex flex-col desktop:justify-end justify-center items-center desktop:items-start aspect-[7/8]"
      >
        <img
          :src="collection.featured_banner ?? collection.banner"
          class="w-full h-full object-cover absolute top-0 left-0 -z-10"
        />
        <div class="title text-[40px]">{{ collection.rus_name }}</div>
        <div class="desktop:static absolute bottom-3 left-3">
          Scandinavian mood. Stone, Wood & Metal
        </div>
      </div>
      <div
        v-if="collection.products"
        class="desktop:w-1/2 w-full flex mt-4 desktop:mt-0 flex-wrap"
      >
        <div class="w-full flex desktop:aspect-[2/1] aspect-[350/240]">
          <div
            class="cursor-pointer w-1/2 h-full pl-0 desktop:p-[30px] p-[20px] border border-l-0 border-black"
          >
            <ProductCard :product-group="collection.products[0]" />
          </div>
          <div
            class="cursor-pointer w-1/2 h-full pr-0 desktop:p-[30px] p-[20px] border-y border-black"
          >
            <ProductCard :product-group="collection.products[1]" />
          </div>
        </div>
        <div class="w-full flex desktop:aspect-[2/1] aspect-[350/240]">
          <div
            class="cursor-pointer w-1/2 h-full pl-0 desktop:p-[30px] p-[20px] border border-t-0 border-l-0 border-black"
          >
            <ProductCard :product-group="collection.products[2]" />
          </div>
          <div
            class="cursor-pointer w-1/2 h-full pr-0 desktop:p-[30px] p-[20px] border-y border-t-0 border-black"
          >
            <ProductCard :product-group="collection.products[3]" />
          </div>
        </div>
        <!-- <div
          class="cursor-pointer w-full desktop:aspect-[2/1] aspect-[350/240] px-0 desktop:p-[30px] p-[20px] desktop:border-b border-black"
        >
          <ProductCard :product-group="collection.products[2]" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
