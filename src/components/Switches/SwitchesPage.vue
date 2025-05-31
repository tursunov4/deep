<script setup lang="ts">
// @ts-nocheck
import { computed, ref, Ref, watch } from "vue";
import SwitchesFilters from "./SwitchesFilters.vue";
import Map from "../Map.vue";
import AboutVideo from "../HomePage/AboutVideo.vue";
import router from "../../router";
import { AppStore } from "../../store/AppStore.ts";
import { components, paths } from "../../types/schema";
import createClient from "openapi-fetch";
import { useI18n } from "vue-i18n";
import { useWindowWidth } from "../../composables/isDesktop.ts";
const { t } = useI18n({ useScope: "global" });
const App = AppStore();
const HOST = import.meta.env.VITE_HOST_NAME;
import SwitchesNewProducts from "./SwitchesNewProducts.vue";
const { POST } = createClient<paths>({ baseUrl: HOST });

const inspirationList = ref<components["schemas"]["PreviewInspiration"][]>([]);
const distributedImages = ref<components["schemas"]["PreviewInspiration"][][]>(
  []
);
const distributedImagesMobile = ref<
  components["schemas"]["PreviewInspiration"][][]
>([]);

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
  Object.keys(obj).map((filter) => {
    try {
      obj[filter] = JSON.parse(obj[filter]);
    } catch (e) {
      return console.error(e); // error in the above string (in this case, yes)!
    }
  });
  return obj;
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
        order_by: filters.value?.sort.toLowerCase(),
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
      order_by: filters.value?.sort.toLowerCase(),
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

watch(filters, () => {
  currentPage.value = 1;
  getInspiration();
});

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
        class="flex flex-col items-center gap-[14px] desktop:gap-[10px] mx-auto my-auto"
      >
        <h1 class="title upercase text-center desktop:text-[40px] text-[32px]">
          Выключатели
        </h1>
        <div
          class="desktop:text-[18px] uppercase text-[10px] font-TT font-bold text-center"
        >
          товары
        </div>
      </div>
    </div>
    <ul
      class="flex justify-end uppercase text-[14px] desktop:gap-5 main-p-sides gap-[30px] mt-[10px] self-start"
    >
      <li @click="router.push('/')" class="cursor-pointer text-customGray">
        {{ t("breadcrumbs.home") }}
      </li>

      <li class="text-bold cursor-pointer">Выключатели</li>

      <li v-if="subcategory">
        {{
          App.language == "ru"
            ? subcategory.subcategory.rus_name.toUpperCase()
            : subcategory.subcategory.eng_name.toUpperCase()
        }}
      </li>
    </ul>
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
            <SwitchesFilters
              @toggle-filter="showFilters = !showFilters"
              :is-opened="showFilters"
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
  <SwitchesNewProducts />
  <div class="flex w-full">
    <div class="desktop:w-[50%] w-full h-[390px] desktop:h-[600px]">
      <Map />
    </div>
    <div class="w-[50%] desktop:block hidden h-[600px]">
      <AboutVideo />
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
