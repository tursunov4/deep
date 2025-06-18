<script setup lang="ts">
// @ts-nocheck
import { computed, ref, Ref, watch, onMounted } from "vue";
import InspirationFilters from "./InspirationFilters.vue";
import router from "../../router";
import { AppStore } from "../../store/AppStore.ts";
import { components, paths } from "../../types/schema";
import createClient from "openapi-fetch";
import { useI18n } from "vue-i18n";
import { useWindowWidth } from "../../composables/isDesktop.ts";
const { t } = useI18n({ useScope: "global" });
const App = AppStore();
const HOST = import.meta.env.VITE_HOST_NAME;
const { POST, GET } = createClient<paths>({ baseUrl: HOST });

const inspirationList = ref<components["schemas"]["PreviewInspiration"][]>([]);
const distributedImages = ref<components["schemas"]["PreviewInspiration"][][]>(
  []
);
const distributedImagesMobile = ref<
  components["schemas"]["PreviewInspiration"][][]
>([]);

// Filter lists from API
const filterLists = ref({
  building: [],
  authors: [],
  styles: [],
  rooms: [],
});

type Filters = {
  building: string[] | undefined;
  authors: string[] | undefined;
  styles: string[] | undefined;
  rooms: string[] | undefined;
  sort: string;
};

const showFilters = ref(false);
const { isDesktop } = useWindowWidth();

const currentPage = ref(1);
const pagesAmount = ref(0);
const productsAmount: Ref<number | undefined> = ref();

const subcategory: Ref<components["schemas"]["List-collections"] | undefined> =
  ref();

const filters: Ref<Filters | undefined> = computed(() => {
  let obj = router.currentRoute.value?.query;

  // Create a new object to ensure reactivity
  const newObj = {};

  Object.keys(obj).forEach((filter) => {
    try {
      newObj[filter] = JSON.parse(obj[filter]);
    } catch (e) {
      newObj[filter] = obj[filter];
    }
  });

  console.log("Filters computed:", newObj);
  return newObj;
});

// Fetch filter lists from API
async function fetchFilter() {
  const { data, error } = await GET("/api/inspiration/filter_list/", {});
  if (error) return;
  if (data) {
    filterLists.value.building = data.building_types;
    filterLists.value.authors = data.authors;
    filterLists.value.styles = data.styles;
    filterLists.value.rooms = data.rooms;
  }
}

// Get selected authors from filter IDs
const selectedAuthors = computed(() => {
  // Force reactivity by explicitly accessing values
  const currentFilters = filters.value;
  const currentFilterLists = filterLists.value;

  console.log("Computing selectedAuthors:", {
    filtersAuthors: currentFilters?.authors,
    authorsListLength: currentFilterLists.authors.length,
  });

  if (!currentFilters?.authors?.length || !currentFilterLists.authors.length) {
    return [];
  }

  const result = currentFilterLists.authors.filter(
    (author) =>
      currentFilters.authors.includes(author.id.toString()) ||
      currentFilters.authors.includes(author.id)
  );

  console.log("Selected authors result:", result);
  return result;
});

// Get selected buildings from filter IDs
const selectedBuildings = computed(() => {
  if (!filters.value?.building?.length || !filterLists.value.building.length) {
    return [];
  }

  return filterLists.value.building.filter((building) =>
    filters.value.building.includes(building.id.toString())
  );
});

// Get selected styles from filter IDs
const selectedStyles = computed(() => {
  if (!filters.value?.styles?.length || !filterLists.value.styles.length) {
    return [];
  }

  return filterLists.value.styles.filter((style) =>
    filters.value.styles.includes(style.id.toString())
  );
});

// Get selected rooms from filter IDs
const selectedRooms = computed(() => {
  if (!filters.value?.rooms?.length || !filterLists.value.rooms.length) {
    return [];
  }

  return filterLists.value.rooms.filter((room) =>
    filters.value.rooms.includes(room.id.toString())
  );
});

async function getInspiration() {
  {
    const { data } = await POST("/api/inspiration/page/{pag_num}/", {
      params: {
        path: {
          pag_num: (currentPage.value - 1).toString(),
        },
      },
      body: {
        authors: filters.value?.authors?.length
          ? filters.value?.authors
          : undefined,
        rooms: filters.value?.rooms?.length ? filters.value?.rooms : undefined,
        styles: filters.value?.styles?.length
          ? filters.value?.styles
          : undefined,
        building: filters.value?.building?.length
          ? filters.value?.building
          : undefined,
        order_by: filters.value?.sort?.toLowerCase(),
      },
    });
    if (data) {
      inspirationList.value = data;
      distributeImages(data, 3);
      distributeImages(data, 2, true);
    }
  }
  const { data } = await POST("/api/inspiration/count_pages/", {
    body: {
      authors: filters.value?.authors?.length
        ? filters.value?.authors
        : undefined,
      rooms: filters.value?.rooms?.length ? filters.value?.rooms : undefined,
      styles: filters.value?.styles?.length ? filters.value?.styles : undefined,
      building: filters.value?.building?.length
        ? filters.value?.building
        : undefined,
      order_by: filters.value?.sort?.toLowerCase(),
    },
  });
  if (data) {
    pagesAmount.value = data.amount_of_pages;
  }
}

const getMeta = (url) => {
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img);
};

async function distributeImages(imageUrls, columnCount, forMobile) {
  const columns = Array.from({ length: columnCount }, () => []);
  const columnHeights = new Array(columnCount).fill(0);

  const images = await Promise.all(
    imageUrls.map((url) => getMeta(url.crop_image ?? url.image))
  );

  images.forEach((img, index) => {
    const smallestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    );
    columnHeights[smallestColumnIndex] += img.naturalHeight / img.naturalWidth;
    columns[smallestColumnIndex].push(imageUrls[index]);
  });

  forMobile
    ? (distributedImagesMobile.value = columns)
    : (distributedImages.value = columns);
}

const filterContainer = ref(null);

// Initialize data on component mount
onMounted(async () => {
  await fetchFilter();
  await getInspiration();
});

// Watch filters to trigger computed updates
watch(
  filters,
  () => {
    currentPage.value = 1;
    getInspiration();
  },
  { deep: true }
);

// Watch filterLists to trigger computed updates
watch(
  filterLists,
  () => {
    // Bu computed propertylarni yangilanishga majbur qiladi
    console.log("Filter lists updated, triggering computed updates");
  },
  { deep: true }
);

// Watch route query changes
watch(
  () => router.currentRoute.value.query,
  () => {
    // Route query o'zgarsa, filterlar ham o'zgaradi
    console.log("Route query changed, filters should update");
  },
  { deep: true }
);

watch(currentPage, () => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  getInspiration();
});
</script>

<template>
  <div class="w-full">
    <div
      class="flex flex-col items-center desktop:mt-[155px] mt-[120px] desktop:mb-[10px] mb-[5px]"
    >
      <div
        class="flex flex-col items-center gap-[14px] desktop:gap-[30px] mx-auto my-auto"
      >
        <h1
          class="title text-center desktop:text-[40px] desktop:leading-[80px] text-[32px] leading-[40px]"
        >
          {{ t("header.inspiration") }}
        </h1>
      </div>
    </div>
    <ul
      class="flex justify-end text-[14px] desktop:gap-5 main-p-sides gap-[30px] mt-[10px] self-start"
    >
      <li @click="router.push('/')" class="cursor-pointer text-customGray">
        {{ t("breadcrumbs.home") }}
      </li>

      <li class="text-bold cursor-pointer">{{ t("header.inspiration") }}</li>

      <li v-if="subcategory">
        {{
          App.language == "ru"
            ? subcategory.subcategory.rus_name.toUpperCase()
            : subcategory.subcategory.eng_name.toUpperCase()
        }}
      </li>
    </ul>

    <!-- Filter bo'yicha tanlangan authorlar -->

    <div>
      <div class="desktop:hidden border-black mt-6">
        <div class="w-full">
          <div
            class="desktop:hidden h-[2px] border-b border-black mx-[20px] my-[20px]"
          />
          <div ref="filterContainer" id="mobileFilter" class="" />
          <div
            v-if="showFilters"
            class="desktop:hidden h-[2px] border-b border-black mx-[20px] my-[20px]"
          />
        </div>
      </div>
      <div class="main-p-sides mt-4">
        <div v-if="selectedAuthors.length" class="mb-4">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="author in selectedAuthors"
              :key="author.id"
              class="border border-black p-5 w-full desktop:w-[370px] flex items-center gap-[30px] wrap"
            >
              <!-- Avatar -->
              <div
                class="w-[96px] h-[96px] rounded-full overflow-hidden border-2 border-black mb-3"
              >
                <img
                  :src="author.icon"
                  alt="Author Icon"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="flex flex-col gap-[20px] justify-between">
                <!-- Author Name -->
                <div class="font-bold uppercase text-sm">
                  {{
                    App.language == "ru"
                      ? author.author_name_ru
                      : author.author_name_en
                  }}
                </div>

                <!-- Architecture / Design -->
                <div class="text-xs tracking-wide font-medium">
                  АРХИТЕКТУРА, ДИЗАЙН
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-[20px] min-h-screen main-p-sides desktop:mt-6">
        <div
          class="grid grid-cols-2 desktop:grid-cols-3 gap-[20px] desktop:w-3/4 w-full"
        >
          <div
            v-for="column in isDesktop
              ? distributedImages
              : distributedImagesMobile"
            class=""
          >
            <div
              v-for="image in column"
              @click="
                router.push({
                  name: 'inspiration-page',
                  params: { id: image.id },
                })
              "
              class="w-full cursor-pointer inline-block desktop:mb-[20px] mb-[30px] column-item"
            >
              <div class="relative w-full group">
                <div
                  class="absolute hidden opacity-0 group-hover:opacity-100 uppercase w-full font-bold text-white font-TT text-[18px] p-[30px] desktop:flex items-end h-full transition-all duration-300 bg-black-general/40"
                >
                  {{ App.language == "ru" ? image.rus_name : image.eng_name }}
                </div>
                <img
                  :src="image.crop_image ?? image.image"
                  class="w-full h-auto"
                />
                <div
                  class="desktop:hidden font-normal text-[12px] mt-[10px] uppercase"
                >
                  {{ App.language == "ru" ? image.rus_name : image.eng_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <teleport
          v-if="filterContainer"
          :disabled="!filterContainer || isDesktop"
          :to="filterContainer"
        >
          <div class="desktop:w-1/4 w-full">
            <InspirationFilters
              @toggle-filter="showFilters = !showFilters"
              :is-opened="showFilters"
              :filter-lists="filterLists"
            />
          </div>
        </teleport>
      </div>
      <div class="main-p-sides my-[80px]">
        <vue-awesome-paginate
          class="font-TT desktop:mt-auto w-full"
          :hide-prev-next="true"
          :total-items="pagesAmount"
          :items-per-page="1"
          v-model="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}

.column-item {
  page-break-inside: avoid;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

.paginate-buttons {
  height: 35px;
  width: 35px;
  cursor: pointer;
  background-color: white;
  border: 1px solid black;
  color: black;
}

.active-page {
  background-color: black;
  border: 1px solid black;
  color: white;
}

@media screen and (max-width: 1100px) {
  .pagination-container {
    justify-content: center;
  }

  .paginate-buttons {
    height: 40px;
    width: 40px;
  }
}

.darker {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
}

@media (hover: hover) {
  .paginate-buttons:hover {
    background-color: black;
    color: white;
  }
}
</style>
