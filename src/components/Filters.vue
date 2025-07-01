<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import RangeSlider from "./RangeSlider.vue";
import { onMounted, Ref, ref } from "vue";
import { components, paths } from "../types/schema";
import createClient from "openapi-fetch";
import { AppStore } from "../store/AppStore.ts";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { t } = useI18n({ useScope: "global" });

const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });
const App = AppStore();
const route = useRoute();
const firstView = ref(true);

defineProps<{
  count: number | undefined;
}>();

const emits = defineEmits([
  "setFilters",
  "preview",
  "hideFilters",
  "loaded",
  "clearFilter",
]);

type IRange = [number | string, number | string];

const rangeValue: Ref<IRange> = ref([0, 99999]);
const filterOptions: string[] = ["DATE" /*, 'POPULARITY', 'RATING'*/];
const selectedOption: Ref<string> = ref("DATE");
const selectedColors: Ref<string[]> = ref(
  route.query?.color ? [route.query?.color as string] : []
);
const selectedCollections: Ref<string[]> = ref(
  route.query?.collection ? [route.query?.collection as string] : []
);
const options: Ref<string[]> = ref(Boolean(route.query?.sale) ? ["sale"] : []);
/*const selectedCategories:Ref<String[]> = ref([])*/
const collections: Ref<components["schemas"]["RetrieveCollection"][]> = ref([]);
const colors: Ref<components["schemas"]["Colour"][]> = ref([]);
const waiting = ref(false);

async function fetchCollections() {
  const { data, error } = await GET("/api/collections/list/", {});
  if (error) return;
  collections.value = data;
}

async function fetchColors() {
  const { data, error } = await GET("/api/product/list_colours/", {});
  if (error) return;
  colors.value = data;
}

function setFilters() {
  emits("setFilters", {
    colors: selectedColors.value.length > 0 ? selectedColors.value : undefined,
    range: rangeValue.value as unknown as [number],
    collections:
      selectedCollections.value.length > 0
        ? selectedCollections.value
        : undefined,
    sale: options.value.includes("sale"),
    featured: options.value.includes("featured"),
  });
}

function setPreview() {
  firstView.value = false;
  emits("preview", {
    colors: selectedColors.value.length > 0 ? selectedColors.value : undefined,
    range: rangeValue.value as unknown as [number],
    collections:
      selectedCollections.value.length > 0
        ? selectedCollections.value
        : undefined,
    sale: options.value.includes("sale"),
    featured: options.value.includes("featured"),
  });
}

function filterNonNumeric() {
  rangeValue.value[0] =
    typeof rangeValue.value[0] == "number"
      ? rangeValue.value[0]
      : rangeValue.value[0].replace(/[^0-9]/g, "");
  rangeValue.value[1] =
    typeof rangeValue.value[1] == "number"
      ? rangeValue.value[1]
      : rangeValue.value[1].replace(/[^0-9]/g, "");
}

function filterValue() {
  if (
    parseInt(<string>rangeValue.value[0]) >
    parseInt(<string>rangeValue.value[1])
  ) {
    rangeValue.value[0] = rangeValue.value[1];
  }
  if (
    parseInt(<string>rangeValue.value[1]) <
    parseInt(<string>rangeValue.value[0])
  ) {
    rangeValue.value[1] = rangeValue.value[0];
  }
}

function selectColor(color: string) {
  if (selectedColors.value.includes(color)) {
    selectedColors.value = selectedColors.value.filter((c) => c !== color);
  } else {
    selectedColors.value.push(color);
  }
}

function clearFilter() {
  selectedColors.value = [];
  selectedCollections.value = [];
  selectedOption.value = "DATE";
  options.value = [];
  rangeValue.value[0] = 0;
  rangeValue.value[1] = 99999;
  setFilters();
  firstView.value = true;
  emits("clearFilter");
}

async function setRange() {
  waiting.value = true;
  await sleep(200);
  waiting.value = false;
  setPreview();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onMounted(async () => {
  await fetchCollections();
  await fetchColors();
});
</script>

<template>
  <div
    class="z-[99] -mx-[20px] desktop:m-0 desktop:w-full h-full desktop:z-0 flex flex-col bg-white overflow-y-auto desktop:p-0"
  >
    <div
      class="flex w-full desktop:uppercase items-center pb-0 gap-8 desktop:p-[1.8750vw] p-[20px]"
    >
      <h2
        class="desktop:text-[18px] desktop:title font-arial font-medium text-[12px]"
      >
        {{ t("filter.filter") }}
      </h2>
      <button
        @click="clearFilter"
        class="ml-auto h-min block desktop:hidden desktop:mt-[-0.6250vm] desktop:text-[0.75vw]"
      >
        {{ t("filter.clear") }}
      </button>
      <button
        @click="$emit('hideFilters')"
        class="w-[60px] h-[40px] tracking-[0.03rem] desktop:hidden bg-black-general text-white aspect-video font-TT text-[10px]"
      >
        {{ t("filter.close") }}
      </button>
    </div>

    <div
      class="flex flex-col gap-4 w-full desktop:aspect-[1.8] border-b border-black p-[20px] pt-0 desktop:p-[1.8750vw] desktop:pb-[1.5625vw] mt-[20px] desktop:mt-[-1.5vw]"
    >
      <h3 class="font-TT text-[18px] desktop:text-[1.1250vw]">
        {{ t("filter.price") }}
      </h3>

      <div
        class="flex w-full desktop:gap-6 gap-[18px] justify-between desktop:justify-start desktop:mt-[-0.0625vw]"
      >
        <input
          type="text"
          @input="filterNonNumeric"
          @change="
            () => {
              filterValue();
              setPreview();
            }
          "
          v-model="rangeValue[0]"
          class="desktop:w-2/5 w-full font-TT text-xl desktop:text-[1.1250vw] border border-black py-3 px-5 desktop:px-[1.1875vw] desktop:h-[35px] h-[35px]"
        />
        <input
          type="text"
          @input="filterNonNumeric"
          @change="
            () => {
              filterValue();
              setPreview();
            }
          "
          v-model="rangeValue[1]"
          class="desktop:w-2/5 w-full font-TT text-xl desktop:text-[1.1250vw] border border-black px-5 desktop:px-[1.1875vw] desktop:h-[35px] h-[35px]"
        />
      </div>

      <div class="w-full mt-4 desktop:mt-[0.8750vw] desktop:p-[0.3125vw]">
        <div class="w-[98%] mx-auto">
          <RangeSlider
            @range="
              (range) => {
                rangeValue = range;
                if (!waiting) {
                  setRange();
                }
              }
            "
            :current-values="rangeValue"
            :end-values="[0, 99999]"
          />
        </div>

        <div
          class="desktop:w-full mx-[13px] desktop:mx-auto mt-4 flex justify-between desktop:mt-[0.5625vw] desktop:text-[16px]"
        >
          <div>{{ Number(rangeValue[0]).toLocaleString("ru-RU") }}</div>
          <div>{{ Number(rangeValue[1]).toLocaleString("ru-RU") }}</div>
        </div>
      </div>
    </div>

    <div
      class="w-full border-b border-black desktop:px-[1.8750vw] p-[15px] px-[20px]"
    >
      <h3
        class="font-TT text-[18px] w-full mb-4 desktop:text-[1.1250vw] desktop:mb-[0.9375vw]"
      >
        {{ t("filter.style") }}
      </h3>
      <div v-for="collection in collections" class="">
        <label
          class="desktop:tracking-[0.035vw] desktop:flex-[1_1_40%] desktop:h-[1.7vw] whitespace-nowrap mr-6 cursor-pointer gap-[10px] font-TT text-lg desktop:text-[0.8750vw] accent-white flex items-center desktop:mb-[10px]"
          ><input
            v-model="selectedCollections"
            @change="setPreview"
            :value="collection.id"
            type="checkbox"
            class=""
          />
          <span
            class="font-TT font-bold text-[3.5897vw] leading-[7.5897vw] desktop:text-[0.8750vw] desktop:leading-[0.8750vw]"
          >
            {{
              App.language == "ru"
                ? collection.rus_filter_name
                : collection.eng_filter_name
            }}
          </span>
        </label>
      </div>
    </div>
    <div
      class="w-full desktop:aspect-[3.15] border-b border-black desktop:px-[1.8750vw] desktop:p-[0.75vw] p-[15px] px-[20px]"
    >
      <h3
        class="font-TT text-[18px] w-full mb-4 desktop:text-[1.1250vw] desktop:mb-[0.9375vw]"
      >
        {{ t("filter.options") }}
      </h3>
      <label
        class="desktop:tracking-[0.035vw] desktop:flex-[1_1_40%] desktop:h-[1.7vw] whitespace-nowrap mr-6 cursor-pointer gap-[10px] font-TT font-bold text-[3.5897vw] leading-[7.5897vw] accent-white flex items-center desktop:text-[0.8750vw] desktop:mb-[10px]"
        ><input
          v-model="options"
          @change="setPreview"
          value="sale"
          type="checkbox"
          class=""
        />
        {{ t("filter.sale") }}
      </label>
      <label
        class="desktop:tracking-[0.035vw] desktop:flex-[1_1_40%] desktop:h-[1.7vw] whitespace-nowrap mr-6 cursor-pointer gap-[10px] font-TT font-bold text-[3.5897vw] leading-[7.5897vw] accent-white flex items-center desktop:text-[0.8750vw] desktop:mb-[10px]"
        ><input
          v-model="options"
          @change="setPreview"
          value="featured"
          type="checkbox"
          class=""
        />
        {{ t("filter.featured") }}
      </label>
    </div>
    <div
      id="scrollbar"
      class="w-full desktop:aspect-[358/400] overflow-y-auto border-b border-black desktop:px-[1.8750vw] desktop:p-[0.75vw] p-[15px] px-[20px]"
    >
      <h3
        class="font-TT text-[18px] w-full mb-4 desktop:text-[1.1250vw] desktop:mb-[0.6250vm]"
      >
        {{ t("filter.color") }}
      </h3>
      <div
        class="grid desktop:grid-cols-4 grid-cols-5 gap-x-[5px] gap-y-[15px] justify-stretch desktop:gap-y-[1.5625vw] desktop:gap-x-[0.6vw]"
      >
        <div v-for="color in colors">
          <img
            @click="
              () => {
                selectColor(color.id.toString());
                setPreview();
              }
            "
            :class="{ border: selectedColors.includes(color.id.toString()) }"
            :src="color.photo"
            class="border-black cursor-pointer w-full aspect-square p-[3px] desktop:p-[0.1875vw]"
          />
          <div
            class="uppercase text-center mt-[6px] font-TT text-[14px] leading-4 tracking-[0.56px] desktop:text-[0.8750vw] desktop:mt-[0.2525vw] desktop:leading-[1vw]"
          >
            {{ App.language == "ru" ? color.rus_name : color.eng_name }}
          </div>
        </div>
      </div>
    </div>

    <!--    <div class="w-full flex flex-wrap p-6 border-b border-black desktop:border-white gap-1">
          <h3 class="font-TT text-xl w-full mb-4">CATEGORIES</h3>
          <div @click="selectCategory('MIRRORS')" :class="{'desktop:bg-white desktop:text-black bg-black-general text-white': selectedCategories.includes('MIRRORS')}" class=" cursor-pointer border border-black desktop:border-white p-2">MIRRORS</div>
          <div @click="selectCategory('TOILET ROLL HOLDERS')" :class="{'desktop:bg-white desktop:text-black bg-black-general text-white': selectedCategories.includes('TOILET ROLL HOLDERS')}" class=" cursor-pointer border border-black desktop:border-white p-2">TOILET ROLL HOLDERS</div>
          <div @click="selectCategory('SHOWER PULLS')" :class="{'desktop:bg-white desktop:text-black bg-black-general text-white': selectedCategories.includes('SHOWER PULLS')}" class=" cursor-pointer border border-black desktop:border-white p-2">SHOWER PULLS</div>
          <div @click="selectCategory('SHELVES')" :class="{'desktop:bg-white desktop:text-black bg-black-general text-white': selectedCategories.includes('SHELVES')}" class=" cursor-pointer border border-black desktop:border-white p-2">SHELVES</div>
          <div @click="selectCategory('TOWER RAILS')" :class="{'desktop:bg-white desktop:text-black bg-black-general text-white': selectedCategories.includes('TOWEL RAILS')}" class=" cursor-pointer border border-black desktop:border-white p-2">TOWEL RAILS</div>
        </div>-->
    <div
      class="w-full flex flex-wrap desktop:aspect-[2.5] font-TT text-[18px] tracking-[0.56px] border-b border-black desktop:px-[1.8750vw] desktop:p-[0.75vw] desktop:pt-[2.5625vm] py-[40px] px-[20px]"
    >
      <h3 class="font-TT text-[18px] w-full mb-4 desktop:text-[1.1250vw]">
        {{ t("filter.sort") }}
      </h3>
      <div class="relative w-full">
        <Listbox v-model="selectedOption">
          <ListboxButton
            class="w-full pb-2 border-b border-black flex justify-between items-center desktop:pb-[0.1vw] desktop:text-[1.1250vw]"
          >
            {{ t("filter.by") + " " + t(`filter.${selectedOption}`) }}
            <span class="triangle"> </span
          ></ListboxButton>
          <div
            class="w-full absolute top-full desktop:top-[2.3vw] bg-white left-0"
          >
            <ListboxOptions>
              <ListboxOption
                v-for="option in filterOptions"
                :key="option"
                :value="option"
                class="py-2 border-black border-b desktop:py-[0.1vw] desktop:text-[1.1250vw]"
              >
                {{ t(`filter.${option}`) }}
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    </div>
    <!--    <div class="w-full flex gap-3 flex-wrap p-6">
          <h3 class="font-TT text-xl w-full mb-4">Options</h3>
          <label class="w-2/5 cursor-pointer  font-TT text-lg accent-white flex gap-1 items-center"><input type="checkbox" class="">SALES
            ONLY</label>
          <label class="w-2/5 cursor-pointer  font-TT text-lg accent-white flex gap-1 items-center"><input type="checkbox"
                                                                                     class="">SPECIALS</label>
          <label class="w-2/5 cursor-pointer  font-TT text-lg accent-white flex gap-1 items-center"><input type="checkbox"
                                                                                     class="">FEATURED</label>
        </div>-->
    <div class="px-6 grow flex items-center desktop:aspect-[385/133]">
      <button
        @click="
          () => {
            setFilters();
            emits('hideFilters');
          }
        "
        class="desktop:tracking-[0.035vw] w-full font-TT hover:bg-white font-bold hover:text-black text-lg p-2 flex justify-center items-center border border-black my-6 mx-auto desktop:text-[1.1250vw] desktop:p-[0.9vw]"
      >
        <span class="pt-[0.1875vw]">
          {{ t("filter.show") }}
          {{
            firstView && !route.query?.sale && !route.query?.color ? "" : count
          }}
        </span>
      </button>
    </div>
    <button
      @click="clearFilter"
      class="m-auto desktop:block hidden text-[#6D6D6D] pb-[30px] desktop:text-[0.75vw]"
    >
      {{ t("filter.clear") }}
    </button>
  </div>
</template>

<style scoped>
:root {
  --form-control-color: rebeccapurple;
  --form-control-disabled: #959495;
}

#scrollbar::-webkit-scrollbar {
  background-color: transparent;
  width: 10px;
}

#scrollbar::-webkit-scrollbar-thumb {
  background-color: #555;
}
#scrollbar ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #000000;
}

#scrollbar {
  scrollbar-width: thin; /* Or a specific width */
  scrollbar-color: #555 #000000; /* Track color, thumb color */
}

input {
  border-radius: 0;
  -webkit-border-radius: 0;
}

input[type="checkbox"] {
  border-radius: 0;
  -webkit-border-radius: 0;
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  appearance: none;
  /* For iOS < 15 */
  background-color: white;
  /* Not removed via appearance */
  margin: 0 0 0 0;

  font: inherit;
  color: white;
  width: 20px;
  height: 20px;
  border: 0.15em solid currentColor;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 14px;
  height: 14px;
  clip-path: polygon(9% 32%, 2% 42%, 41% 78%, 96% 19%, 89% 10%, 41% 63%);
  visibility: hidden;
  transform-origin: bottom left;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em black;
  /* Windows High Contrast Mode */
  background-color: white;
  margin: 0 0 0 0;
}

.triangle {
  background-color: white;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  width: 7px;
  height: 7px;
  rotate: 180deg;
}

input[type="checkbox"]:checked::before {
  visibility: visible;
}

input[type="checkbox"]::before {
  background-color: black;
  box-shadow: inset 1em 1em white;
}

input[type="checkbox"] {
  border-radius: 0;
  -webkit-border-radius: 0;
  background-color: white;
  color: black;
  border: 1px solid black;
}
input[type="checkbox"]:checked {
  background-color: black;
}

.triangle {
  background-color: black;
}
</style>
