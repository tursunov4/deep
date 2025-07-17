<script setup lang="ts">
import AboutVideo from "./HomePage/AboutVideo.vue";
import Map from "./Map.vue";
import { useI18n } from "vue-i18n";
import { components } from "../types/schema";
import { AppStore } from "../store/AppStore.ts";
import router from "../router";

const App = AppStore();

defineProps<{
  categories: components["schemas"]["CountCategory"][] | undefined;
}>();

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="">
    <div
      class="w-[100%] font-TT uppercase text-[32px] font-bold mt-[100px] whitespace-pre-wrap leading-[1.1] pl-[22px] pr-[18px]"
    >
      {{ t("about.title_1_mobile") }}
    </div>
    <div
      class="w-[100%] font-TT text-[18px] mt-[23px] mb-[40px] whitespace-pre-wrap leading-[1.1] pl-[22px] pr-[18px] text-[#8B8B8B]"
    >
      {{ t("about.title_2_mobile").toUpperCase() }}
    </div>
    <div id="video" class="w-full aspect-[390/420]">
      <AboutVideo :showreel="false" :about="false" />
    </div>

    <div
      class="w-[260px] font-TT text-[32px] mt-[40px] whitespace-pre-wrap leading-[1.1] pl-[22px] pr-[18px] font-bold"
    >
      {{ t("about.title_3_mobile").toUpperCase() }}
    </div>

    <div
      class="w-[100%] font-TT text-[18px] mt-[24px] mb-[55px] whitespace-pre-wrap leading-[1.1] pl-[22px] pr-[18px] text-[#8B8B8B]"
    >
      {{ t("about.title_4_mobile").toUpperCase() }}
    </div>

    <div class="w-full pl-[19px] pr-[19px] mb-[19px]">
      <div
        class="aspect-[740/420] bg-cover bg-center bg-no-repeat bg-[url('./assets/ProductPage/depp_inspire.png')] flex items-center justify-center relative"
      >
        <div
          class="text-white font-TT text-[4.464vi] font-bold absolute top-[22px] left-[21px]"
        >
          {{ t("about.inspiration") }}
        </div>
      </div>
    </div>

    <div class="w-full mb-[19px]">
      <div class="ml-[18px] mr-[18px] border-b border-black"></div>
    </div>

    <div class="w-full pl-[19px] pr-[19px]">
      <div
        class="aspect-[740/420] bg-cover bg-center bg-no-repeat bg-[url('./assets/ProductPage/create.png')] flex items-center justify-center relative"
      >
        <div
          class="text-white font-TT text-[4.464vi] font-bold absolute top-[22px] left-[21px]"
        >
          {{ t("about.create") }}
        </div>
      </div>
    </div>

    <div
      class="w-[100%] font-TT text-[6.2vi] mt-[62px] whitespace-pre-wrap leading-[1] pl-[22px] font-bold"
    >
      {{ t("about.products").toUpperCase() }}
    </div>
    <div class="w-full mb-[19px]">
      <div class="ml-[18px] mr-[18px] border-b border-black"></div>
    </div>
    <div class="font-TT text-[2.976vi] pl-[22px] mb-[19px]">
      {{ t("about.market_by_colors") }}
    </div>
    <template v-for="category in categories">
      <div
        @click="
          router.push('/category/' + category.eng_name);
          $emit('hide');
        "
        class="font-TT text-[4.464vi] font-bold mt-[-4px] pl-[17px] justify-between flex pr-[17px]"
      >
        <div>
          {{
            App.language == "ru"
              ? category.rus_name.toUpperCase()
              : category.eng_name.toUpperCase()
          }}
        </div>
        <div class="font-TT text-[4.464vi] font-bold mt-[-4px]">
          {{ Math.floor(Math.random() * 49) }}
        </div>
      </div>
    </template>
    <div
      class="font-TT text-[4.464vi] font-bold mt-[-4px] pl-[17px] justify-between flex pr-[17px]"
    >
      <div class="font-TT text-[4.464vi] font-bold">
        {{ t("breadcrumbs.doors") }}
      </div>
      <div class="font-TT text-[4.464vi] font-bold mt-[-4px]">4</div>
    </div>
    <div class="w-full mb-[0px] mt-[18px]">
      <div class="ml-[18px] mr-[18px] border-b border-black"></div>
    </div>
    <!--    PDF     -->
    <div class="flex">
      <a href="https://depp-d.com/media/catalog/catalog.pdf" target="_blank">
        <div class="pl-[22px] mb-[63px] aspect-square">
          <div
            class="w-[60px] h-[60px] aspect-square border border-black p-[11px] mt-[20px]"
          >
            <div
              class="w-full h-full bg-contain bg-center bg-no-repeat bg-[url('./assets/PDF.png')]"
            />
          </div>
        </div>
      </a>
      <div>
        <div
          class="mt-[20px] font-TT text-[4.464vi] font-bold whitespace-pre-wrap leading-[1.2] pl-[21px]"
        >
          {{ t("DEPP COLLECTION") }}
        </div>
        <div class="pl-[21px] mt-[11px] text-[12px]">PDF</div>
      </div>
    </div>

    <div
      class="w-[100%] font-TT text-[32px] whitespace-pre-wrap leading-[1] pl-[9px] font-bold mb-[20px]"
    >
      {{ t("about.map").toUpperCase() }}
    </div>

    <div class="w-full aspect-[390/419]">
      <Map />
    </div>
  </div>
</template>

<style scoped></style>
