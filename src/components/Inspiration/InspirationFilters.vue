<script setup lang="ts">
//@ts-nocheck
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { computed, onMounted, reactive, Ref, ref, watch } from "vue";
import { paths } from "../../types/schema";
import createClient from "openapi-fetch";
import { AppStore } from "../../store/AppStore.ts";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { InspirationFilters } from "../../types/types.ts";
import router from "../../router";
import { useWindowWidth } from "../../composables/isDesktop.ts";

const HOST = import.meta.env.VITE_HOST_NAME;
const { GET, POST } = createClient<paths>({ baseUrl: HOST });
const { isDesktop } = useWindowWidth();
const { t } = useI18n({ useScope: "global" });
const App = AppStore();
const route = useRoute();
const firstView = ref(true);

defineProps<{
  isOpened: boolean;
}>();

const emits = defineEmits(["toggleFilter"]);

const resultAmount = ref(null);

type IRange = [number | string, number | string];

const filterOptions: string[] = ["DATE", "POPULARITY", "RATING"];
const selectedOption: Ref<string> = ref("DATE");
const options: Ref<string[]> = ref(Boolean(route.query?.sale) ? ["sale"] : []);
const filters = reactive<InspirationFilters>({
  authors: {
    collapsed: true,
    list: [],
    element: undefined,
    selected: [],
  },
  styles: {
    collapsed: true,
    list: [],
    element: undefined,
    selected: [],
  },
  rooms: {
    collapsed: true,
    list: [],
    element: undefined,
    selected: [],
  },
  building: {
    collapsed: true,
    list: [],
    element: undefined,
    selected: [],
  },
});

const authorsElement = ref<HTMLElement | undefined>();
const stylesElement = ref<HTMLElement | undefined>();
const buildingElement = ref<HTMLElement | undefined>();
const roomsElement = ref<HTMLElement | undefined>();

function selectAuthor(author: number) {
  if (filters.authors.selected.includes(author)) {
    filters.authors.selected = filters.authors.selected.filter(
      (c) => c !== author
    );
  } else {
    filters.authors.selected.push(author);
  }
}

async function fetchFilter() {
  const { data, error } = await GET("/api/inspiration/filter_list/", {});
  if (error) return;
  if (data) {
    filters.building.list = data.building_types;
    filters.authors.list = data.authors;
    filters.styles.list = data.styles;
    filters.rooms.list = data.rooms;
  }
}

function setFilters() {
  const query = {
    building:
      filters.building.selected.length > 0
        ? JSON.stringify(filters.building.selected)
        : undefined,
    authors:
      filters.authors.selected.length > 0
        ? JSON.stringify(filters.authors.selected)
        : undefined,
    room:
      filters.rooms.selected.length > 0
        ? JSON.stringify(filters.rooms.selected)
        : undefined,
    styles:
      filters.styles.selected.length > 0
        ? JSON.stringify(filters.styles.selected)
        : undefined,
    sort: selectedOption.value
      ? JSON.stringify(selectedOption.value)
      : undefined,
  };
  router.replace({ path: "/inspirations/", query: query });
}

function setPreview() {
  /*firstView.value = false
  emits('preview', {
    colors: selectedColors.value.length > 0 ? selectedColors.value : undefined,
    range: rangeValue.value as unknown as [number],
    collections: selectedCollections.value.length > 0 ? selectedCollections.value : undefined,
    sale: options.value.includes('sale'),
    featured: options.value.includes('featured')
  })*/
}

function clearFilter() {
  filters.building.selected = [];
  filters.rooms.selected = [];
  filters.styles.selected = [];
  filters.authors.selected = [];
}

onMounted(async () => {
  await fetchFilter();
  filters.authors.element = authorsElement.value;
  filters.styles.element = stylesElement.value;
  filters.building.element = buildingElement.value;
  filters.rooms.element = roomsElement.value;
  setFilters();
});

async function getCount() {
  const isFilterActive =
    filters.styles.selected.length > 0 ||
    filters.building.selected.length > 0 ||
    filters.rooms.selected.length > 0 ||
    filters.authors.selected.length > 0;
  if (!isFilterActive) return;
  const { data } = await POST("/api/inspiration/count_pages/", {
    body: {
      authors: filters.authors.selected?.length
        ? filters.authors.selected
        : undefined,
      rooms: filters.rooms.selected?.length
        ? filters.rooms.selected
        : undefined,
      styles: filters.styles.selected?.length
        ? filters.styles.selected
        : undefined,
      building: filters.building.selected?.length
        ? filters.building.selected
        : undefined,
      order_by: selectedOption.value.toLowerCase(),
    },
  });
  if (data) {
    resultAmount.value = data.amount_of_images;
  }
}

const showCount = computed(() => {
  const isQueryActive = Object.keys(router.currentRoute.value.query).length > 1;
  const isFilterActive =
    filters.styles.selected.length > 0 ||
    filters.building.selected.length > 0 ||
    filters.rooms.selected.length > 0 ||
    filters.authors.selected.length > 0;
  const isDesktopOrOpened = isDesktop || (!isDesktop && isOpened);

  if (isDesktopOrOpened) {
    if (isQueryActive && !isFilterActive) return true;
    if (isFilterActive) return true;
  }

  if (!isDesktop && !isOpened) return isQueryActive;

  return false;
});

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

watch(filters, () => {
  getCount();
});

watch(showCount, () => {
  if (!showCount.value) {
    resultAmount.value = undefined;
  }
});
</script>

<template>
  <div v-if="!isDesktop && !isOpened">
    <div
      @click="$emit('toggleFilter')"
      class="mx-[20px] h-[40px] py-[20px] desktop:py-[0] mb-[20px] flex items-center title text-lg border border-black"
    >
      <div class="w-full text-center uppercase">{{ t("filter.filter") }}</div>
      <div
        v-if="showCount"
        class="w-1/5 bg-black font-TT h-full flex justify-center items-center text-white"
      >
        {{ resultAmount }}
      </div>
    </div>
  </div>
  <div
    v-show="isDesktop || (!isDesktop && isOpened)"
    class="z-[99] desktop:border overflow-y-visible border-black desktop:m-0 desktop:w-full desktop:z-0 flex text-black flex-col bg-white desktop:p-0"
  >
    <div
      class="flex w-full desktop:px-[30px] pb-[5px] p-[20px] desktop:border-b border-black desktop:uppercase items-center pb-0 gap-8"
    >
      <h2
        class="desktop:title font-arial font-medium desktop:text-[18px] text-[12px]"
      >
        {{ t("filter.filter") }}
      </h2>
      <button @click="clearFilter" class="ml-auto h-min text-[14px]">
        {{ t("filter.clear") }}
      </button>
      <button
        @click="$emit('toggleFilter')"
        class="w-[60px] h-[40px] tracking-[0.03rem] desktop:hidden bg-black-general text-white aspect-video font-TT text-[10px]"
      >
        {{ t("filter.close") }}
      </button>
    </div>
    <div
      class="w-full uppercase border-b border-black desktop:pb-[30px] pb-[25px]"
    >
      <h3
        class="font-TT desktop:p-[30px] desktop:pt-[10px] desktop:pb-[25px] p-[20px] text-[18px] w-full pb-[25px]"
      >
        {{ t("filter.building") }}
      </h3>
      <div>
        <div
          v-for="building in [...filters.building.list].slice(0, 5)"
          class="odd:bg-[#F7F7F7] text-[14px] tracking-[0.03rem]"
        >
          <label
            class="desktop:px-[30px] h-[30px] py-[5px] px-[20px] desktop:flex-[1_1_40%] whitespace-nowrap cursor-pointer gap-[10px] font-TT accent-white flex w-full items-center"
            ><input
              v-model="filters.building.selected"
              @change="setPreview"
              :value="building.id"
              type="checkbox"
              class=""
            />
            <span class="font-TT font-bold">
              {{ App.language == "ru" ? building.rus_name : building.eng_name }}
            </span>
            <span class="ml-auto font-bold">{{
              building.count_inspirations
            }}</span>
          </label>
        </div>
        <div ref="buildingElement" class="section" :style="{ height: '0' }">
          <div
            v-for="building in [...filters.building.list].slice(5)"
            :class="[
              'text-[14px] tracking-[0.03rem]',
              filters.building.list.length % 2 == 0
                ? 'odd:bg-[#F7F7F7]'
                : 'even:bg-[#F7F7F7]',
            ]"
          >
            <label
              class="desktop:px-[30px] h-[30px] py-[5px] px-[20px] desktop:flex-[1_1_40%] whitespace-nowrap cursor-pointer gap-[10px] font-TT accent-white flex w-full items-center"
              ><input
                v-model="filters.building.selected"
                @change="setPreview"
                :value="building.id"
                type="checkbox"
                class=""
              />
              <span class="font-TT font-bold">
                {{
                  App.language == "ru" ? building.rus_name : building.eng_name
                }}
              </span>
              <span class="ml-auto font-bold">{{
                building.count_inspirations
              }}</span>
            </label>
          </div>
        </div>
      </div>
      <button
        v-if="filters.building.list.length > 5"
        @click="
          filters.building.collapsed
            ? expandSection(filters.building.element)
            : collapseSection(filters.building.element);
          filters.building.collapsed = !filters.building.collapsed;
        "
        class="cursor-pointer font-TT uppercase text-[14px] tracking-[0.03rem] mt-[30px] w-full font-bold"
      >
        {{
          filters.building.collapsed ? t("filter.show_all") : t("filter.hide")
        }}
      </button>
    </div>
    <div
      class="w-full uppercase border-b border-black desktop:pb-[30px] pb-[25px]"
    >
      <h3
        class="font-TT desktop:p-[30px] desktop:pb-[25px] p-[20px] text-[18px] w-full pb-[25px]"
      >
        {{ t("filter.room") }}
      </h3>
      <div>
        <div
          v-for="room in [...filters.rooms.list].slice(0, 5)"
          class="odd:bg-[#F7F7F7] text-[14px] tracking-[0.03rem]"
        >
          <label
            class="desktop:px-[30px] h-[30px] py-[5px] px-[20px] desktop:flex-[1_1_40%] whitespace-nowrap cursor-pointer gap-[10px] font-TT accent-white flex w-full items-center"
            ><input
              v-model="filters.rooms.selected"
              @change="setPreview"
              :value="room.id"
              type="checkbox"
              class=""
            />
            <span class="font-TT font-bold">
              {{ App.language == "ru" ? room.rus_name : room.eng_name }}
            </span>
            <span class="ml-auto font-bold">{{ room.count_inspirations }}</span>
          </label>
        </div>
        <div ref="roomsElement" class="section" :style="{ height: '0' }">
          <div
            v-for="room in [...filters.rooms.list].slice(5)"
            :class="[
              'text-[14px] tracking-[0.03rem]',
              filters.rooms.list.length % 2 == 0
                ? 'odd:bg-[#F7F7F7]'
                : 'even:bg-[#F7F7F7]',
            ]"
          >
            <label
              class="desktop:px-[30px] h-[30px] py-[5px] px-[20px] desktop:flex-[1_1_40%] whitespace-nowrap cursor-pointer gap-[10px] font-TT accent-white flex w-full items-center"
              ><input
                v-model="filters.rooms.selected"
                @change="setPreview"
                :value="room.id"
                type="checkbox"
                class=""
              />
              <span class="font-TT font-bold">
                {{ App.language == "ru" ? room.rus_name : room.eng_name }}
              </span>
              <span class="ml-auto font-bold">{{
                room.count_inspirations
              }}</span>
            </label>
          </div>
        </div>
      </div>
      <button
        v-if="filters.rooms.list.length > 5"
        @click="
          filters.rooms.collapsed
            ? expandSection(filters.rooms.element)
            : collapseSection(filters.rooms.element);
          filters.rooms.collapsed = !filters.rooms.collapsed;
        "
        class="cursor-pointer font-TT uppercase text-[14px] tracking-[0.03rem] mt-[30px] w-full font-bold"
      >
        {{ filters.rooms.collapsed ? t("filter.show_all") : t("filter.hide") }}
      </button>
    </div>
    <div
      class="w-full uppercase border-b border-black pb-[25px] desktop:pb-[30px]"
    >
      <h3
        class="font-TT desktop:px-[30px] px-[20px] my-[30px] text-[18px] w-full"
      >
        {{ t("filter.authors") }}
      </h3>
      <div class="">
        <div
          class="w-full -ml-[3px] grid mb-[20px] grid-cols-3 gap-x-[12px] desktop:px-[30px] px-[20px] gap-y-[20px] justify-items-stretch"
        >
          <div
            v-for="author in [...filters.authors.list].slice(0, 3)"
            class="w-full aspect-[105/95]"
          >
            <img
              :src="author.icon"
              @click="
                () => {
                  selectAuthor(author.id);
                  setPreview();
                }
              "
              :class="{
                'border-black/100': filters.authors.selected.includes(
                  author.id
                ),
              }"
              class="w-full rounded-full border-black/0 border p-[3px] text-black object-cover aspect-square"
            />
            <div
              class="text-center font-TT tracking-[0.045rem] font-bold text-[14px] break-words mt-[10px]"
            >
              {{
                App.language == "ru" && author.author_name_ru
                  ? author.author_name_ru
                  : author.author_name
              }}
            </div>
          </div>
        </div>
        <div
          v-if="filters.authors.list.length > 3"
          ref="authorsElement"
          :style="{ height: '0' }"
          class="section w-full -ml-[3px] grid grid-cols-3 gap-x-[12px] desktop:px-[30px] px-[20px] gap-y-[20px] justify-items-stretch"
        >
          <div
            v-for="author in [...filters.authors.list].slice(3)"
            class="w-full aspect-[105/95]"
          >
            <img
              :src="author.icon"
              @click="
                () => {
                  selectAuthor(author.id);
                  setPreview();
                }
              "
              :class="{
                'border-black/100': filters.authors.selected.includes(
                  author.id
                ),
              }"
              class="w-full border object-cover border-black/0 p-[3px] text-black aspect-square"
            />
            <div
              class="text-center font-TT tracking-[0.045rem] font-bold text-[14px] break-words mt-[10px]"
            >
              {{ author.author_name }}
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="filters.authors.list.length > 3"
        @click="
          filters.authors.collapsed
            ? expandSection(filters.authors.element)
            : collapseSection(filters.authors.element);
          filters.authors.collapsed = !filters.authors.collapsed;
        "
        class="cursor-pointer font-TT uppercase text-[14px] tracking-[0.03rem] mt-[30px] w-full font-bold"
      >
        {{
          filters.authors.collapsed ? t("filter.show_all") : t("filter.hide")
        }}
      </button>
    </div>
    <div
      class="w-full uppercase desktop:border-b border-black desktop:border-white"
    >
      <h3
        class="font-TT desktop:px-[30px] desktop:p-[30px] p-[20px] text-[18px] w-full pb-[25px]"
      >
        {{ t("filter.style") }}
      </h3>
      <div>
        <div
          v-for="style in [...filters.styles.list].slice(0, 5)"
          class="odd:bg-[#F7F7F7] text-[14px] tracking-[0.03rem]"
        >
          <label
            class="desktop:px-[30px] h-[30px] py-[5px] px-[20px] desktop:flex-[1_1_40%] whitespace-nowrap cursor-pointer gap-[10px] font-TT accent-white flex w-full items-center"
            ><input
              v-model="filters.styles.selected"
              @change="setPreview"
              :value="style.id"
              type="checkbox"
              class=""
            />
            <span class="font-TT font-bold">
              {{ App.language == "ru" ? style.rus_name : style.eng_name }}
            </span>
            <span class="ml-auto font-bold">{{
              style.count_inspirations
            }}</span>
          </label>
        </div>
        <div ref="stylesElement" class="section" :style="{ height: '0' }">
          <div
            v-for="style in [...filters.styles.list].slice(5)"
            :class="[
              'text-[14px] tracking-[0.03rem]',
              filters.styles.list.length % 2 == 1
                ? 'odd:bg-[#F7F7F7]'
                : 'even:bg-[#F7F7F7]',
            ]"
          >
            <label
              class="desktop:px-[30px] h-[30px] py-[5px] px-[20px] desktop:flex-[1_1_40%] whitespace-nowrap cursor-pointer gap-[10px] font-TT accent-white flex w-full items-center"
              ><input
                v-model="filters.styles.selected"
                @change="setPreview"
                :value="style.id"
                type="checkbox"
                class=""
              />
              <span class="font-TT font-bold">
                {{ App.language == "ru" ? style.rus_name : style.eng_name }}
              </span>
              <span class="ml-auto font-bold">{{
                style.count_inspirations
              }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div
      class="uppercase text-center font-TT text-[14px] tracking-[0.03rem] py-[25px] border-b border-black font-bold"
    >
      <span
        v-if="filters.styles.list.length > 5"
        @click="
          filters.styles.collapsed
            ? expandSection(filters.styles.element)
            : collapseSection(filters.styles.element);
          filters.styles.collapsed = !filters.styles.collapsed;
        "
        class="cursor-pointer"
        >{{
          filters.styles.collapsed ? t("filter.show_all") : t("filter.hide")
        }}</span
      >
    </div>
    <div class="w-full font-TT">
      <h3
        class="font-TT text-[18px] w-full pt-[45px] desktop:pl-[30px] pl-[20px] uppercase"
      >
        {{ t("filter.sort") }}
      </h3>
      <div
        class="relative desktop:px-[30px] px-[20px] leading-4 text-[18px] uppercase mt-[20px] w-full"
      >
        <Listbox v-model="selectedOption">
          <template #default="{ open }">
            <ListboxButton
              :class="[
                'w-full p-[20px] border font-bold uppercase border-black flex justify-between items-center',
                { 'bg-black text-white': open },
              ]"
            >
              {{ t("filter.by") + " " + t(`filter.${selectedOption}`) }}
              <span
                :class="[
                  'triangle',
                  open ? 'bg-white rotate-180' : 'bg-black-general',
                ]"
                class="transition-all duration-300"
              >
              </span
            ></ListboxButton>
            <div
              class="w-full absolute z-[99] desktop:px-[30px] px-[20px] top-full left-0"
            >
              <ListboxOptions>
                <ListboxOption
                  v-for="option in filterOptions"
                  :key="option"
                  :value="option"
                  class="p-[20px] border font-bold cursor-pointer bg-white border-black border-t-0"
                >
                  {{ t(`filter.${option}`) }}
                </ListboxOption>
              </ListboxOptions>
            </div>
          </template>
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
    <div class="flex items-center">
      <button
        @click="
          () => {
            setFilters();
            emits('toggleFilter');
          }
        "
        class="desktop:tracking-[0.035vw] w-full font-TT hover:bg-black font-bold hover:text-white p-2 flex justify-center items-center desktop:border-t desktop:border-b-0 desktop:border-l-0 desktop:border-r-0 border desktop:mx-0 mx-5 border-black mt-6 mx-auto text-[18px] desktop:p-[23px]"
      >
        <span class="pt-[0.1875vw]">
          {{ t("filter.show") }}
          {{
            showCount && (resultAmount || resultAmount == 0) ? resultAmount : ""
          }}
        </span>
      </button>
    </div>
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
  border: 1px solid black;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;
}

input[type="checkbox"]:checked {
  background-color: black;
}

input[type="checkbox"]::before {
  content: "";
  width: 14px;
  height: 14px;
  clip-path: polygon(9% 32%, 2% 42%, 41% 78%, 96% 19%, 89% 10%, 41% 63%);
  visibility: hidden;
  transform-origin: bottom left;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em white;
  /* Windows High Contrast Mode */
  background-color: black;
  margin: 0 0 0 0;
}

.triangle {
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  width: 7px;
  height: 7px;
  rotate: 180deg;
}

input[type="checkbox"]:checked::before {
  visibility: visible;
}

@media screen and (max-width: 1100px) {
  input[type="checkbox"]::before {
    background-color: white;
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
}
</style>
