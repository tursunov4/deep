<script setup lang="ts">
import router from "../../router";
import MainCaurousel from "./MainCaurousel.vue";
import TypesCarousel from "./TypesCarousel.vue";
import { useI18n } from "vue-i18n";
import DoorsCarousel from "./DoorsCarousel.vue";
import createClient from "openapi-fetch";
import { components, paths } from "../../types/schema";
import { ref } from "vue";
import { AppStore } from "../../store/AppStore.ts";
import CoversCarousel from "./CoversCarousel.vue";
import FinishingMaterialsCarousel from "./FinishingMaterialsCarousel.vue";
const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });

const { t } = useI18n({ useScope: "global" });
const info = ref<components["schemas"]["DoorPage"] | null>();
const covers = ref<components["schemas"]["Cover"][]>([]);
const handles = ref<components["schemas"]["HandlerLock"][]>([]);
const locks = ref<components["schemas"]["Lock"][]>([]);
const App = AppStore();

async function fetchPage() {
  const { data, error } = await GET("/api/door-page/door_page/", {});
  if (error || !data) return;
  info.value = data;
}

async function fetchCovers() {
  const { data, error } = await GET("/api/door-page/covers/", {});
  if (error || !data) return;
  covers.value = data;
}

async function fetchHandles() {
  const { data, error } = await GET("/api/door-page/handler_locks/", {});
  if (error || !data) return;
  handles.value = data;
}

async function fetchLocks() {
  const { data, error } = await GET("/api/door-page/locks/", {});
  if (error || !data) return;
  locks.value = data;
}

let coversCollapsed = ref(true);
let coversElement = ref<HTMLElement | undefined>();
let handlesCollapsed = ref(true);
let handlesElement = ref<HTMLElement | undefined>();

function collapseSection(element: HTMLElement | undefined) {
  if (!element) return;
  console.log(element);
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;

  // temporarily disable all css transitions
  var elementTransition = element.style.transition;
  element.style.transition = "";

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function () {
    element.style.height = sectionHeight + "px";
    element.style.transition = elementTransition;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function () {
      element.style.height = 0 + "px";
    });
  });
}

function expandSection(element: HTMLElement | undefined) {
  console.log(element);
  if (!element) return;

  // Set the initial height to 0 to start the transition
  element.style.height = "0px";

  // Ensure the element has a CSS transition for height
  element.style.transition = "height 0.3s ease"; // Adjust the duration and easing as needed

  // Trigger a reflow to ensure the height change is noticed by the browser
  element.offsetHeight; // This forces the browser to recognize the change

  // Set the height to the element's scroll height to expand it
  var sectionHeight = element.scrollHeight;
  element.style.height = sectionHeight + "px";

  // Create a handler function for the transition end event
  function transitionEndHandler() {
    if (!element) return;
    // Remove this event listener so it only gets triggered once
    element.removeEventListener("transitionend", transitionEndHandler);

    // Remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = "";
    element.style.transition = ""; // Optional: Remove transition if it's only for this purpose
  }

  // Add the event listener for the transition end
  element.addEventListener("transitionend", transitionEndHandler);

  // Mark the section as "currently not collapsed"
  element.setAttribute("data-collapsed", "false");
}

fetchPage();
fetchCovers();
fetchHandles();
fetchLocks();
</script>

<template>
  <div class="desktop:block hidden">
    <div
      class="flex flex-col items-center desktop:mt-[155px] mt-[120px] mb-[50px]"
    >
      <div
        class="flex flex-col uppercase items-center gap-[14px] desktop:gap-[30px] mx-auto my-auto"
      >
        <h1
          class="title text-center desktop:text-[40px] desktop:leading-[10px] text-[32px] leading-[10px]"
        >
          {{ App.language === "ru" ? info?.ru_name : info?.eng_name }}
        </h1>
        <div
          class="desktop:text-[18px] min-h-[27px] text-[10px] font-TT font-bold text-center"
        >
          {{ App.language === "ru" ? info?.ru_title : info?.eng_title }}
        </div>
      </div>
    </div>
  </div>
  <div
    class="desktop:block hidden desktop:mb-[20px] mb-[10px] text-[14px] uppercase px-[20px] flex desktop:justify-end justify-start gap-3"
  >
    <RouterLink class="text-customGray" to="/">
      {{ t("breadcrumbs.home") }}
    </RouterLink>
    -
    <RouterLink to="#">
      {{ App.language === "ru" ? info?.ru_name : info?.eng_name }}
    </RouterLink>
  </div>
  <div
    class="desktop:h-[80vh] w-full desktop:aspect-auto aspect-[390/420] desktop:mb-[65px] mb-[43px] -mt-1 desktop:mt-[40px] overflow-visible"
  >
    <MainCaurousel
      v-if="info?.cover_images.length"
      :images="info?.cover_images ? [...info?.cover_images] : []"
    />
  </div>
  <div
    class="desktop:hidden desktop:mb-[20px] mb-[10px] text-[14px] uppercase px-[20px] flex desktop:justify-end justify-start gap-3"
  >
    <RouterLink class="text-customGray" to="/">
      {{ t("breadcrumbs.home") }}
    </RouterLink>
    -
    <RouterLink to="#">
      {{ App.language === "ru" ? info?.ru_name : info?.eng_name }}</RouterLink
    >
  </div>

  <div class="desktop:hidden w-2/3 px-[20px]">
    <div
      class="flex flex-col desktop:mt-[155px] mt-[10px] desktop:mb-[100px] mb-[20px]"
    >
      <div
        class="flex uppercase flex-col gap-[10px] desktop:gap-[10px] desktop:mx-auto my-auto"
      >
        <h1
          class="title desktop:text-[80px] pr-[40px] desktop:leading-[80px] text-[32px] leading-[40px]"
        >
          {{ App.language === "ru" ? info?.ru_name : info?.eng_name }}
        </h1>
        <div class="desktop:text-[18px] text-[12px]">
          {{ App.language === "ru" ? info?.ru_title : info?.eng_title }}
        </div>
      </div>
    </div>
  </div>
  <div
    class="desktop:mx-[30px] desktop:py-[30px] py-[20px] border-black border-y mx-[20px]"
  >
    <div class="desktop:-mx-[30px] -mx-[20px]">
      <DoorsCarousel />
    </div>
  </div>
  <div
    class="desktop:mb-[30px] mb-[20px] desktop:text-[36px] desktop:mt-[80px] mt-[60px] text-[32px] font-TT font-bold leading-[36px] desktop:mx-[30px] mx-[20px] uppercase"
  >
    {{
      App.language === "ru"
        ? info?.combination_title_name_ru
        : info?.combination_title_name_eng
    }}
  </div>
  <div class="overflow-visible">
    <TypesCarousel />
  </div>
  <div
    :style="{ 'background-color': `${info?.hight_background}` }"
    class="w-full desktop:min-h-[350px] before:content-[''] before:float-left before:pb-[27%] text-white desktop:mt-[120px] desktop:px-[30px] px-[20px] pt-[40px] desktop:flex"
  >
    <div class="desktop:w-1/2 w-2/3 h-full">
      <h2
        class="font-TT text-[32px] leading-[40px] desktop:mb-[40px] mb-[20px] font-bold uppercase"
      >
        {{
          App.language === "ru"
            ? info?.hight_title_name_ru
            : info?.hight_title_name_eng
        }}
      </h2>
      <div
        v-html="
          App.language === 'ru'
            ? info?.hight_description_ru
            : info?.hight_description_eng
        "
        class="desktop:text-[18px] desktop:leading-6 leading-[13.6px] whitespace-pre-line mb-[40px] text-[12px]"
      ></div>
    </div>
    <div class="desktop:w-1/2 mt-[50px] desktop:mt-0 flex justify-center">
      <img :src="info?.hight_image ?? ''" class="h-full" />
    </div>
  </div>
  <div
    class="w-full flex justify-center aspect-[390/160] items-center desktop:aspect-[1600/320] relative"
  >
    <div class="absolute z-10 top-0 left-0 h-full w-full bg-black/20" />
    <img
      :src="info?.collections_background_image ?? ''"
      class="absolute z-0 top-0 left-0 w-full h-full object-cover"
    />
    <button
      @click="router.push('/catalogs/#doors')"
      class="h-[60px] z-10 px-[56px] pt-[6px] hover:desktop:bg-white hover:desktop:text-black desktop:border border-white text-white font-TT font-bold text-[18px] flex items-center uppercase"
    >
      {{ t("doors_page.see_catalogs") }}
    </button>
  </div>
  <div>
    <CoversCarousel />
  </div>
  <div class="desktop:px-[30px] desktop:block hidden px-[20px] uppercase">
    <div
      class="font-TT text-[32px] mt-[80px] mb-[30px] leading-10 uppercase font-bold"
    >
      {{ t("doors_page.finishing_materials") }}
    </div>
    <div
      class="w-full flex desktop:flex-nowrap flex-wrap border-black border-t border-l mt-6"
    >
      <div
        v-for="cover in [...covers].slice(0, 4)"
        class="cursor-pointer desktop:w-1/4 w-1/2 aspect-square border-black border-r border-b desktop:p-[30px] p-2"
      >
        <div class="w-full mb-4 aspect-square">
          <img class="w-full h-full object-cover" :src="cover?.image" />
        </div>
        <div class="w-full flex justify-between">
          <div>
            {{ App.language === "ru" ? cover?.rus_name : cover?.eng_name }}
          </div>
          <div>{{ t("doors_page.explore") }}</div>
        </div>
      </div>
    </div>
    <div
      ref="coversElement"
      :style="{ height: '0' }"
      class="w-full section flex desktop:flex-nowrap flex-wrap border-black border-l"
    >
      <div
        v-for="cover in [...covers].slice(4)"
        class="cursor-pointer desktop:w-1/4 w-1/2 aspect-square border-black border-r border-b desktop:p-[30px] p-2"
      >
        <div class="w-full mb-4 aspect-square">
          <img class="w-full h-full object-cover" :src="cover?.image" />
        </div>
        <div class="w-full flex justify-between">
          <div>
            {{ App.language === "ru" ? cover?.rus_name : cover?.eng_name }}
          </div>
          <div>{{ t("doors_page.explore") }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <button
        @click="
          coversCollapsed
            ? expandSection(coversElement)
            : collapseSection(coversElement);
          coversCollapsed = !coversCollapsed;
        "
        v-if="covers.length > 4"
        class="desktop:w-1/4 w-full h-[50px] font-TT pt-[6px] font-bold desktop:h-[60px] mx-auto hover:desktop:bg-black-general text-[18px] hover:desktop:text-white text-black uppercase border-black border mt-[30px]"
      >
        {{ coversCollapsed ? t("filter.show_all") : t("filter.hide") }}
      </button>
    </div>
  </div>
  <div class="desktop:hidden">
    <FinishingMaterialsCarousel />
  </div>
  <div
    class="uppercase font-TT leading-10 text-[32px] desktop:mt-[80px] mt-[60px] mb-[30px] px-[20px] desktop:px-[30px] font-bold"
  >
    {{
      App.language === "ru"
        ? info?.handle_title_name_ru
        : info?.handle_title_name_eng
    }}
  </div>
  <div class="border-black desktop:border border-b desktop:mx-[30px]">
    <div
      v-for="handle in [...handles].slice(0, 1)"
      class="desktop:grid justify-items-stretch content-stretch grid-cols-2"
    >
      <div
        :style="{ 'background-image': `url(${handle.image})` }"
        class="bg-no-repeat desktop:w-auto desktop:aspect-auto w-full aspect-[416/214] bg-cover bg-center"
      />
      <div class="desktop:px-[30px] px-[20px] py-[30px] break-words">
        <h3
          class="font-TT font-bold text-[25px] uppercase desktop:text-[40px] mb-[40px]"
        >
          {{ App.language == "ru" ? handle?.name_ru : handle?.name_eng }}
        </h3>
        <div
          :class="[handlesCollapsed ? 'border-b-0' : 'border-b']"
          class="font-TT font-normal text-[25px] border-black desktop:border-0 uppercase text-[25px] desktop:text-[40px] desktop:pb-0 pb-[20px] leading-7 desktop:leading-10 text-black/40"
        >
          {{
            App.language == "ru"
              ? handle?.ru_description
              : handle?.eng_description
          }}
        </div>
      </div>
    </div>
    <div ref="handlesElement" class="section" :style="{ height: '0' }">
      <div
        v-for="(handle, index) in [...handles].slice(1)"
        class="desktop:grid content-stretch justify-items-stretch grid-cols-2"
      >
        <div
          :style="{ 'background-image': `url(${handle.image})` }"
          class="bg-no-repeat desktop:w-auto desktop:aspect-auto w-full aspect-[416/214] bg-cover bg-center"
        />
        <div class="desktop:px-[30px] px-[20px] py-[30px] break-words">
          <h3
            class="font-TT font-bold uppercase text-[25px] desktop:text-[40px] mb-[40px]"
          >
            {{ App.language == "ru" ? handle?.name_ru : handle?.name_eng }}
          </h3>
          <div
            :class="[
              index === [...handles].slice(1).length - 1
                ? 'border-b-0'
                : 'border-b',
            ]"
            class="font-TT font-normal uppercase text-[25px] border-black desktop:text-[40px] desktop:leading-10 leading-7 desktop:pb-0 pb-[20px] text-black/40"
          >
            {{
              App.language == "ru"
                ? handle?.ru_description
                : handle?.eng_description
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="desktop:flex justify-center px-[20px] desktop:p-0">
    <button
      @click="
        handlesCollapsed
          ? expandSection(handlesElement)
          : collapseSection(handlesElement);
        handlesCollapsed = !handlesCollapsed;
      "
      v-if="handles.length > 1"
      class="desktop:w-1/4 w-full h-[50px] font-TT pt-[6px] font-bold desktop:h-[60px] mx-auto hover:desktop:bg-black-general text-[18px] hover:desktop:text-white text-black uppercase border-black border mt-[30px]"
    >
      {{ handlesCollapsed ? t("filter.show_all") : t("filter.hide") }}
    </button>
  </div>
  <div class="desktop:px-[30px] px-0 mb-[80px] uppercase">
    <div
      class="font-TT leading-10 px-[20px] desktop:px-0 desktop:text-[40px] text-[32px] mt-[80px] mb-[30px] font-bold"
    >
      {{
        App.language === "ru"
          ? info?.lock_title_name_ru
          : info?.lock_title_name_eng
      }}
    </div>
    <div v-for="(lock, index) in locks">
      <div
        :class="[index === 0 ? 'desktop:mt-0' : 'desktop:mt-[120px]']"
        class="w-full desktop:mb-[80px]"
      >
        <div
          class="w-full desktop:aspect-[1538/439] desktop:mt-6 border-t desktop:border-l desktop:flex desktop:flex-wrap border-black"
        >
          <div
            class="desktop:w-1/2 grid grid-cols-1 relative desktop:border-r desktop:border-b border-black justify-items-stretch place-items-stretch"
          >
            <img :src="lock.image" class="" />
          </div>
          <div
            class="flex-1 desktop:px-[30px] px-[20px] py-[30px] border-b border-r border-black break-words"
          >
            <h3
              class="font-TT font-bold desktop:text-[40px] desktop:leading-[40px] text-[25px] desktop:mb-[40px] mb-[20px]"
            >
              {{ App.language == "ru" ? lock?.name_ru : lock?.name_eng }}
            </h3>
            <div
              class="font-TT font-normal desktop:text-[40px] text-[25px] desktop:leading-10 leading-7 opacity-40"
            >
              {{
                App.language == "ru"
                  ? lock?.ru_description
                  : lock?.eng_description
              }}
            </div>
          </div>
        </div>
        <div
          class="flex overflow-x-scroll -my-[1px] hide-scrollbar pl-[1px] desktop:pl-0 desktop:mx-0 desktop:flex-wrap desktop:border-l border-black"
        >
          <div
            v-for="step in lock.step_images"
            class="desktop:w-1/4 w-[40vw] shrink-0 flex flex-col desktop:p-[28px] p-[18px] border -ml-[1px] desktop:ml-0 desktop:border-t-0 desktop:border-l-0 border-black"
          >
            <div class="w-full relative">
              <img
                :src="step.image"
                class="w-full aspect-[136/145] block m-auto"
              />
            </div>
            <div class="flex justify-between text-[10px] mt-2">
              <div class="">
                {{ App.language == "ru" ? step?.name_ru : step?.name_eng }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
