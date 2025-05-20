<script setup lang="ts">
// @ts-nocheck
import { AppStore } from "../../store/AppStore.ts";
import { components, paths } from "../../types/schema";
import createClient from "openapi-fetch";
import { useI18n } from "vue-i18n";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import router from "../../router";
import CollectionsSelector from "./CollectionsSelector.vue";
import { HeaderStore } from "../../store/HeaderStore.ts";
import { useElementBounding } from "@vueuse/core";
import { vElementVisibility } from "@vueuse/components";
import MobileCollectionsCarousel from "./MobileCollectionsCarousel.vue";
import { useRoute } from "vue-router";

const { t } = useI18n({ useScope: "global" });
const route = useRoute();
const Header = HeaderStore();
const App = AppStore();
const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });

const collections = ref<components["schemas"]["Collection"][]>([]);
const openedCollections = ref<number[]>([]);

function toggleCollection(id: number) {
  let index = openedCollections.value.findIndex(
    (collection) => collection === id
  );
  if (index >= 0) {
    openedCollections.value.splice(index, 1);
    return;
  }
  openedCollections.value.push(id);
}

const selectorButton = ref<HTMLElement | null>();

async function fetchCollections() {
  const { data } = await GET("/api/collections/list/", {});
  if (data) {
    collections.value = data;
    Header.collections.collections = data;
  }
  await nextTick();
  let collection = document.getElementById(route.query?.collection);
  if (collection) {
    collection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

onMounted(fetchCollections);

function onCollectionView(state: boolean, id: number) {
  if (state) {
    Header.collections.selectedCollectionId = id;
  }
}

function isOpened(id: number) {
  return (
    openedCollections.value.findIndex((collection) => collection === id) > -1
  );
}

watch(
  () => Header.collections.needsScroll,
  () => {
    if (!Header.collections.needsScroll) return;
    let collection = document.getElementById(
      Header.collections.selectedCollectionId.toString()
    );
    if (collection) {
      collection.scrollIntoView({ behavior: "smooth", block: "start" });
      Header.collections.needsScroll = false;
    }
  }
);

const rect = reactive(useElementBounding(selectorButton));

watch(rect, () => {
  Header.collections.visible =
    document.documentElement.clientWidth > 1100 ? rect.top < 30 : rect.top < 78;
});
</script>

<template>
  <div
    class="flex flex-col items-center desktop:mt-[155px] mt-[120px] desktop:mb-[60px] mb-[60px]"
  >
    <div
      class="flex flex-col items-center gap-[14px] desktop:gap-[30px] mx-auto my-auto"
    >
      <h1
        class="title text-center desktop:text-[40px] desktop:leading-[0px] text-[32px] leading-[0px]"
      >
        {{ t("header.collections") }}
      </h1>
      <div
        class="desktop:text-[18px] desktop:min-h-[27px] hidden desktop:block text-[10px] font-TT font-bold text-center"
      >
        {{ collections.length }}
      </div>
    </div>
  </div>
  <div
    class="flex desktop:flex-nowrap flex-wrap mt-[60px] desktop:mt-0 mb-[30px]"
  >
    <ul
      class="flex desktop:gap-5 w-1/2 mt-auto main-p-sides gap-[30px] self-start"
    >
      <li @click="router.push('/')" class="cursor-pointer">
        {{ t("breadcrumbs.home") }}
      </li>
      <li @click="router.push('/collections')" class="cursor-pointer">
        {{ t("breadcrumbs.collections") }}
      </li>
    </ul>
    <div
      ref="selectorButton"
      class="desktop:w-1/4 w-full relative z-50 desktop:pr-[30px] desktop:mt-auto mt-[15px] desktop:h-[80px] aspect-[350/54]"
    >
      <CollectionsSelector :visible="Header.collections.visible" />
    </div>
  </div>
  <!--  <div class="flex flex-col h-[390px] desktop:h-[500px]">
    <div class="flex flex-col items-center gap-[14px] desktop:gap-[30px] mx-auto my-auto desktop:mt-[260px]">
      <h1 class="title text-center desktop:text-[80px] desktop:leading-[80px] text-[40px] leading-[40px]">
        {{
          t('header.collections')
        }}</h1>
      <div class="desktop:text-[18px] text-[14px] font-TT font-bold text-center">{{
          collections.length
        }}
      </div>
    </div>
  </div>
  <div class="w-full desktop:flex desktop:mt-[93px] mb-[30px]">
    <ul class="flex desktop:gap-5 desktop:w-1/2 -mt-20 main-p-sides gap-[30px] self-end desktop:mt-0">
      <li @click="router.push('/')" class="cursor-pointer">{{ t('breadcrumbs.home') }}</li>
      <li @click="router.push('/collections')" class="cursor-pointer">{{ t('breadcrumbs.collections') }}</li>
    </ul>
    <div ref="selectorButton" :class="Header.collections.visible ? 'opacity-0':'opacity-100'" class="desktop:w-1/4 relative z-50 desktop:pr-[30px] desktop:mt-auto mt-[15px] desktop:h-[5vw] desktop:aspect-auto aspect-[350/54]">
      <CollectionsSelector/>
    </div>
  </div>-->
  <div>
    <div
      :id="collection.id.toString()"
      v-for="(collection, index) in Header.collections.collections"
      :class="{ 'desktop:mt-[120px] mt-[80px]': index !== 0 }"
      class="relative desktop:scroll-m-[10.4375vw] mb-[80px] scroll-m-28 text-base font-bold text-white font-TT"
    >
      <!--      <div class="absolute z-0 top-0 left-0 w-full h-full">
              <img :src="collection.banner" class="w-full object-cover object-center aspect-[80/19]"/>
            </div>-->
      <div class="w-full flex flex-col relative z-0">
        <div class="relative flex px-[20px] desktop:px-[60px] flex-col">
          <div
            class="pt-[30px] hidden desktop:block z-20 mb-[11px] text-lg text-center"
          >
            {{ ("0" + (index + 1)).slice(-2) }}
          </div>
          <div
            class="desktop:border desktop:w-1/2 z-20 relative desktop:px-[80px] px-[20px] desktop:pt-[90px] pt-[68px] border-white mx-auto grow-0 font-TT"
          >
            <div
              class="desktop:text-[4.5cqw] desktop:leading-[4.5cqw] leading-10 text-center text-[40px]"
            >
              {{
                App.language == "ru" ? collection.rus_name : collection.eng_name
              }}
            </div>
            <div class="mt-[10px] text-center desktop:mb-[48px] mb-[10px]">
              {{ collection.year }}
            </div>
          </div>
          <div
            class="w-[1px] z-20 bg-white mx-auto desktop:h-[80px] h-[40px]"
          />
          <div class="absolute z-10 top-0 left-0 h-full w-full bg-black/20" />
          <img
            :src="collection.banner"
            class="w-full h-full z-0 top-0 left-0 absolute object-cover object-center"
          />
        </div>
        <div
          :style="{ 'background-color': `${collection.background_color}` }"
          class="desktop:px-[30px] px-[20px]"
        >
          <div class="relative border-white border-b flex flex-col">
            <div class="w-[1px] bg-white h-[18px] z-20 mx-auto" />
            <div
              class="mx-auto h-full py-[12px] font-arial text-[12px] font-normal"
            >
              {{
                App.language == "ru"
                  ? collection.rus_title
                  : collection.eng_title
              }}
            </div>
            <div
              class="desktop:flex text-[12px] mx-[30px] hidden font-arial font-normal justify-center"
            >
              <div
                v-element-visibility="
                  (state) => onCollectionView(state, collection.id)
                "
                class="w-1/4 whitespace-pre-wrap leading-[14px] pr-[40px] mb-[66px]"
              >
                {{
                  App.language == "ru"
                    ? collection.rus_description
                    : collection.eng_description
                }}
              </div>
              <div class="w-[1px] bg-white z-20" />
              <div
                class="w-1/4 whitespace-pre-wrap leading-[14px] pl-[40px] mb-[40px]"
              >
                {{
                  App.language == "ru"
                    ? collection.rus_description_2
                    : collection.eng_description_2
                }}
              </div>
            </div>
            <div
              v-element-visibility="
                (state) => onCollectionView(state, collection.id)
              "
              class="font-arial text-[12px] leading-normal desktop:hidden font-normal"
            >
              <div class="mb-[30px]">
                {{
                  App.language == "ru"
                    ? collection.rus_description
                    : collection.eng_description
                }}
              </div>

              {{
                App.language == "ru"
                  ? collection.rus_description_2
                  : collection.eng_description_2
              }}
              <div
                class="w-[1px] z-20 bg-white mx-auto mt-[20px] leading-normal desktop:hidden h-[40px]"
              />
            </div>
          </div>
        </div>
        <div
          :style="{
            height: `${
              isOpened(collection.id)
                ? 28 * Math.ceil(collection.categories.length / 4)
                : 28
            }vw`,
          }"
          class="relative w-full hidden desktop:block overflow-hidden transition-all duration-700 px-[30px] pt-[30px]"
        >
          <div
            :style="{ 'background-color': `${collection.background_color}` }"
            class="absolute z-0 top-0 left-0 w-full h-[10vw]"
          />
          <div class="px-[30px] w-full flex flex-wrap">
            <RouterLink
              :to="{
                path: '/sub-category/' + category.eng_name,
                query: { collection: collection.id },
              }"
              class="w-1/4 flex items-end relative aspect-[370/424]"
              v-for="category in collection.categories"
            >
              <img
                :src="category.banner"
                class="absolute z-0 top-0 left-0 h-full w-full object-cover"
              />
              <div
                class="grow text-[40px] p-[30px] leading-[1.1] relative z-10 w-full pr-[182px]"
              >
                {{
                  App.language == "ru" ? category.rus_name : category.eng_name
                }}
              </div>
            </RouterLink>
          </div>
        </div>
        <div class="desktop:hidden relative pt-[30px]">
          <div
            :style="{ 'background-color': `${collection.background_color}` }"
            class="absolute z-0 top-0 left-0 w-full h-1/3"
          />
          <MobileCollectionsCarousel :collection="collection" />
        </div>
        <div
          class="mx-[30px] border-t desktop:flex hidden justify-center border-black mt-[30px]"
        >
          <button
            @click="toggleCollection(collection.id)"
            v-if="collection.categories.length > 4"
            class="w-1/4 hover:bg-black-general text-[18px] hover:text-white aspect-[325/60] text-black uppercase border-black border mt-[30px]"
          >
            {{
              isOpened(collection.id)
                ? t("filter.hide")
                : t("main.right_top_desc")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  transition: all;
  transition-duration: 2s;
}
</style>
