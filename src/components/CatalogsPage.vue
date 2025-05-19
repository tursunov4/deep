<script setup lang="ts">
import createClient from "openapi-fetch";
import { components, paths } from "../types/schema";
import { nextTick, onMounted, ref } from "vue";
import { AppStore } from "../store/AppStore.ts";
import router from "../router";

const App = AppStore();
const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });

const catalogs = ref<components["schemas"]["Catalog"][]>([]);

async function fetchCatalogs() {
  const { data } = await GET("/api/catalogs/", {});
  if (data) {
    catalogs.value = data;
  }
  if (router.currentRoute.value.hash.split("#")[1]) {
    await nextTick();
    console.log(router.currentRoute.value.hash.split("#")[1]);
    document
      .getElementById(router.currentRoute.value.hash.split("#")[1])
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }
}

onMounted(fetchCatalogs);
</script>

<template>
  <div class="w-full mb-[80px]">
    <div class="">
      <div
        class="flex flex-col items-center desktop:mt-[155px] mt-[120px] mb-[65px]"
      >
        <div
          class="flex flex-col uppercase items-center gap-[14px] desktop:gap-[10px] mx-auto my-auto"
        >
          <h1
            class="title text-center desktop:text-[40px] desktop:leading-[80px] text-[32px] leading-[40px]"
          >
            <template v-if="App.language == 'ru'">
              Ката<span class="pl-[2px]">л</span>оги
            </template>
            <template v-else> Catalogs </template>
          </h1>
          <div
            class="desktop:text-[18px] desktop:min-h-[27px] text-[10px] font-TT font-bold text-center"
          />
        </div>
      </div>
    </div>
    <div
      class="desktop:text-end text-start mx-[20px] desktop:mx-[30px] uppercase pb-5 text-[14px]"
    >
      <RouterLink to="/">ГЛАВНАЯ</RouterLink> -
      <a class="font-bold" href="">Каталоги</a>
    </div>
    <div
      v-for="catalog in catalogs"
      :id="catalog.catalog_name_eng.toLowerCase()"
      class="desktop:flex desktop:mx-[30px] mx-[20px] desktop:border-t desktop:pt-[30px] border-black font-bold desktop:mt-0 mt-[1 0px]"
    >
      <div
        class="desktop:w-1/4 border-black pb-[7px] desktop:pr-[40px] desktop:pb-0 overflow-hidden border-b break-words desktop:border-none font-TT text-[32px] desktop:text-[40px]"
      >
        {{
          App.language == "ru"
            ? catalog.catalog_name_ru.toUpperCase()
            : catalog.catalog_name_eng.toUpperCase()
        }}
      </div>
      <div
        class="desktop:w-3/4 grow grid desktop:grid-cols-6 grid-cols-2 gap-x-[20px] mt-[30px] text-[18px] desktop:mt-0 gap-y-[40px]"
      >
        <a
          class="cursor-pointer"
          v-for="subcatalog in catalog.subcatalogs"
          target="_blank"
          :href="App.language == 'ru' ? subcatalog.pdf_ru : subcatalog.pdf_eng"
        >
          <img
            class="desktop:aspect-[175/240] aspect-[165/233] object-cover w-full"
            :src="
              App.language == 'ru'
                ? subcatalog.banner_ru ?? ''
                : subcatalog.banner_eng ?? ''
            "
          />
          <div class="text-center uppercase font-TT mt-[20px]">
            {{
              App.language == "ru" ? subcatalog.ru_name : subcatalog.eng_name
            }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
