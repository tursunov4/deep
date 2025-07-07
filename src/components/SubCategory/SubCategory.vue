<script setup lang="ts">
// @ts-nocheck
import NewProducts from "../HomePage/NewProducts.vue";
import { computed, onMounted, onUnmounted, ref, watch, Ref } from "vue";
import Filters from "../Filters.vue";
import Map from "../Map.vue";
import AboutVideo from "../HomePage/AboutVideo.vue";
import router from "../../router";
import { useRoute } from "vue-router";
import { AppStore } from "../../store/AppStore.ts";
import { components, paths } from "../../types/schema";
import createClient from "openapi-fetch";
import ProductCard from "../ProductCard.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });
const App = AppStore();
const HOST = import.meta.env.VITE_HOST_NAME;
const { PATCH, POST } = createClient<paths>({ baseUrl: HOST });

type Filters = {
  colors: string[] | undefined;
  range: [number, number];
  collections: string[];
  sale: boolean;
  featured: boolean;
};

type SortFilters = "date";

const route = useRoute();

let firstSearch = true;

const showFilters = ref(false);
const windowWidth = ref(window.innerWidth);

const onWidthChange = () => (windowWidth.value = window.innerWidth);
onMounted(() => window.addEventListener("resize", onWidthChange));
onUnmounted(() => window.removeEventListener("resize", onWidthChange));

const type = computed(() => {
  if (windowWidth.value < 1100) return "mobile";
  else return false;
});

const currentPage = ref(1);
const pagesAmount = ref(0);
const productsAmount: Ref<number | undefined> = ref();

const preferredCollection: Ref<
  components["schemas"]["ShowColInSubc"] | undefined
> = ref();

const subcategory: Ref<components["schemas"]["List-collections"] | undefined> =
  ref();

const filters: Ref<Filters | undefined> = ref();

async function fetchPrefered() {
  if (!route.query.collection) return;
  let body = {
    subcategory_eng_name: router.currentRoute.value.params.id as string,
    prefered_collection: parseInt(route.query.collection as string),
    lowest_cost: filters.value ? filters.value.range[0] : 0,
    highest_cost: filters.value ? filters.value.range[1] : 99999999,
    order_by: "date" as SortFilters,
  };
  const { data, error } = await PATCH("/api/subcategory/prefered/", {
    body: body,
  });
  if (error) return;
  preferredCollection.value = data;
}

async function fetchPages(previewFilters?: Filters) {
  let body;
  if (firstSearch) {
    body = {
      subcategory_eng_name: router.currentRoute.value.params.id as string,
      prefered_collection: filters.value
        ? undefined
        : parseInt(route.query.collection as string),
      lowest_cost: filters.value ? filters.value.range[0] : 0,
      highest_cost: filters.value ? filters.value.range[1] : 99999999,
      order_by: "date" as SortFilters,
      colours: route.query?.color ? [route.query?.color as string] : undefined,
      collections: filters.value?.collections
        ? filters.value.collections.map((str) => +str)
        : undefined,
      sale: Boolean(route.query?.sale),
      featured: filters.value?.featured,
    };
  } else if (previewFilters) {
    body = {
      subcategory_eng_name: router.currentRoute.value.params.id as string,
      prefered_collection: previewFilters
        ? undefined
        : parseInt(route.query.collection as string),
      lowest_cost: previewFilters ? previewFilters.range[0] : 0,
      highest_cost: previewFilters ? previewFilters.range[1] : 99999999,
      order_by: "date" as SortFilters,
      colours: previewFilters?.colors
        ? previewFilters.colors.map((str) => +str)
        : undefined,
      collections: previewFilters?.collections
        ? previewFilters.collections.map((str) => +str)
        : undefined,
      sale: previewFilters?.sale,
      featured: previewFilters?.featured,
    };
  } else {
    body = {
      subcategory_eng_name: router.currentRoute.value.params.id as string,
      prefered_collection: filters.value
        ? undefined
        : parseInt(route.query.collection as string),
      lowest_cost: filters.value ? filters.value.range[0] : 0,
      highest_cost: filters.value ? filters.value.range[1] : 99999999,
      order_by: "date" as SortFilters,
      colours: filters.value?.colors
        ? filters.value.colors.map((str) => +str)
        : undefined,
      collections: filters.value?.collections
        ? filters.value.collections.map((str) => +str)
        : undefined,
      sale: filters.value?.sale,
      featured: filters.value?.featured,
    };
  }
  const { data, error } = await POST("/api/new-subcategory/amount_of_pages/", {
    //@ts-ignore
    body: body,
  });
  if (error) return;
  if (previewFilters) {
    //@ts-ignore
    productsAmount.value = data.amount_of_products;
    return;
  } else if (route.query?.sale || route.query?.color) {
    productsAmount.value = data.amount_of_products;
  }
  //@ts-ignore
  pagesAmount.value = data.amount_of_pages;
}

async function fetchSubcategory() {
  let body;
  if (firstSearch) {
    body = {
      subcategory_eng_name: router.currentRoute.value.params.id as string,
      prefered_collection: filters.value
        ? undefined
        : parseInt(route.query.collection as string),
      lowest_cost: filters.value ? filters.value.range[0] : 0,
      highest_cost: filters.value ? filters.value.range[1] : 99999999,
      order_by: "date" as SortFilters,
      colours: route.query?.color ? [route.query?.color as string] : undefined,
      collections: filters.value?.collections
        ? filters.value.collections.map((str) => +str)
        : undefined,
      sale: Boolean(route.query?.sale),
      featured: filters.value?.featured,
    };
  } else
    body = {
      subcategory_eng_name: router.currentRoute.value.params.id as string,
      prefered_collection: filters.value
        ? undefined
        : parseInt(route.query.collection as string),
      lowest_cost: filters.value ? filters.value.range[0] : 0,
      highest_cost: filters.value ? filters.value.range[1] : 99999999,
      order_by: "date" as SortFilters,
      colours: filters.value?.colors
        ? filters.value.colors.map((str) => +str)
        : undefined,
      collections: filters.value?.collections
        ? filters.value.collections.map((str) => +str)
        : undefined,
      sale: filters.value?.sale,
      featured: filters.value?.featured,
    };
  const { data, error } = await PATCH("/api/new-subcategory/page/{pag_num}/", {
    //@ts-ignore
    body: body,
    params: {
      path: {
        pag_num: (currentPage.value - 1).toString(),
      },
    },
  });
  if (error) return;
  subcategory.value = data;
}

let scrollTop: number;

function openFilters() {
  showFilters.value = true;
  /*  let body = document.querySelector('body') as HTMLBodyElement | null
    let html = document.querySelector('html') as HTMLBodyElement | null
    if (body && html) {
      scrollTop = (html.scrollTop) ? html.scrollTop : body.scrollTop;
      const b = document.body;
      b.style.setProperty('--st', -(document.documentElement.scrollTop) + "px");
      b.classList.add('noscroll');
    }*/
}

function closeFilter() {
  showFilters.value = false;
  let body = document.querySelector("body") as HTMLBodyElement | null;
  let html = document.querySelector("html") as HTMLBodyElement | null;
  if (body && html) {
    const b = document.body;
    b.classList.remove("noscroll");
    html.scrollTo(0, scrollTop);
  }
}

watch(type, () => {
  if (!type.value) {
    closeFilter();
  }
});

onMounted(() => {
  fetchPrefered();
  fetchPages();
  fetchSubcategory();
  firstSearch = false;
});

watch(filters, () => {
  currentPage.value = 1;
  fetchPages();
  fetchSubcategory();
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

watch(currentPage, () => {
  fetchSubcategory();
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

watch(
  () => router.currentRoute.value,
  async () => {
    currentPage.value = 1;
    firstSearch = true;
    await fetchPrefered();
    await fetchPages();
    await fetchSubcategory();
    firstSearch = false;
  }
);
</script>

<template>
  <div class="w-full">
    <div
      class="flex flex-col items-center desktop:mt-[155px] mt-[120px] desktop:mb-[45px] mb-[50px]"
    >
      <div class="flex flex-col items-center gap-[14px] mx-auto my-auto">
        <h1
          class="title text-center desktop:text-[40px] uppercase desktop:leading-[40px] text-[32px]"
        >
          {{
            App.language == "ru"
              ? subcategory?.subcategory?.rus_name
              : subcategory?.subcategory?.eng_name
          }}
        </h1>
        <div
          class="desktop:text-[18px] uppercase desktop:min-h-[27px] hidden desktop:block text-[14px] font-TT font-bold text-center"
        >
          {{ t("browse_category.browse_category") }}
        </div>
      </div>
    </div>
    <ul
      class="flex desktop:gap-5 main-p-sides gap-[30px] mt-[60px] desktop:mt-0 justify-start desktop:justify-end"
    >
      <li @click="router.push('/')" class="cursor-pointer">
        {{ t("breadcrumbs.home") }}
      </li>
      <li @click="router.push('/collections')" class="cursor-pointer">
        {{ t("breadcrumbs.collections") }}
      </li>
      <li v-if="subcategory">
        {{
          App.language == "ru"
            ? subcategory.subcategory.rus_name.toUpperCase()
            : subcategory.subcategory.eng_name.toUpperCase()
        }}
      </li>
    </ul>
    <div>
      <div class="desktop:hidden h-full mx-[20px] mt-6">
        <div class="border-black w-full h-full">
          <keep-alive class="h-full">
            <Filters
              @clear-filter="productsAmount = undefined"
              @hideFilters="closeFilter"
              @preview="(newFilters) => fetchPages(newFilters)"
              @set-filters="(newFilters) => (filters = newFilters)"
              :count="productsAmount"
              v-if="showFilters"
              class="desktop:hidden"
            />
          </keep-alive>
          <div
            v-if="!showFilters"
            @click="openFilters"
            class="w-full h-[40px] my-6 flex items-center title text-lg border border-black"
          >
            <div class="w-full text-center uppercase">
              {{ t("filter.filter") }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex main-p-sides mt-6">
        <div
          class="grid grid-flow-row-dense border-black desktop:border-t [&>*]:desktop:border-black [&>*]:desktop:border-b items-stretch desktop:grid-cols-3 desktop:grid-rows-3 grid-cols-2 w-full"
        >
          <div
            v-if="preferredCollection && currentPage == 1"
            class="w-full aspect-[2/1] desktop:aspect-auto col-span-2"
          >
            <div
              class="relative w-full h-full text-white darker flex flex-col p-4"
            >
              <img
                :src="preferredCollection.banner"
                class="object-cover top-0 left-0 -z-10 w-full h-full absolute"
              />
              <h1 class="title mx-auto my-auto">
                {{
                  App.language == "ru"
                    ? preferredCollection.rus_name.toUpperCase()
                    : preferredCollection.eng_name.toUpperCase()
                }}
              </h1>
              <div class="place-self-start">
                {{
                  App.language == "ru"
                    ? preferredCollection.rus_description
                    : preferredCollection.eng_description
                }}
              </div>
            </div>
          </div>
          <div
            v-if="preferredCollection"
            v-for="(product, index) in preferredCollection.abstracts"
            class="cursor-pointer w-full flex flex-col p-4"
            :class="[
              {
                'desktop:col-span-3 desktop:aspect-[2/1]':
                  preferredCollection.abstracts.length - 1 == index &&
                  preferredCollection.abstracts.length % 4 == 2,
              },
              {
                'desktop:col-span-2 desktop:aspect-[3/1]':
                  preferredCollection.abstracts.length - 1 == index &&
                  preferredCollection.abstracts.length % 4 == 3,
              },
            ]"
          >
            <ProductCard :product-group="product" />
          </div>
          <template v-for="(product, index) in subcategory?.objects_on_page">
            <div
              v-if="product.collection_type"
              :class="
                currentPage == 1 ? 'col-span-2 aspect-[2/1]' : 'col-span-1'
              "
              class="w-full desktop:border-l desktop:aspect-auto"
            >
              <div
                class="relative w-full h-full text-white darker flex flex-col p-4"
              >
                <img
                  :src="product?.banner"
                  class="object-cover top-0 left-0 -z-10 w-full h-full absolute"
                />
                <h1 class="title mx-auto uppercase my-auto">
                  {{
                    App.language == "ru" ? product.rus_name : product.eng_name
                  }}
                </h1>
                <div class="place-self-start">
                  {{
                    App.language == "ru"
                      ? product.rus_description
                      : product.eng_description
                  }}
                </div>
              </div>
            </div>
            <div
              v-else-if="currentPage == 1"
              :class="[
                // Agar oxirgi element bo‘lsa va u juft bo‘lsa, col-span-2 holat qo‘shiladi
                index === subcategory?.objects_on_page.length - 1 &&
                index % 2 === 1
                  ? 'col-span-2 aspect-[350/240] desktop:col-span-1 px-0 desktop:p-[30px] aspect-[385/440]'
                  : '',

                // Agar bu oxirgi element bo‘lsa, border-r qo‘shiladi (agar kerak bo‘lsa)
                index == subcategory?.objects_on_page.length - 1
                  ? 'desktop:border-r'
                  : '',
                index == 7 ? 'desktop:border-r-0' : '',
              ]"
              class="cursor-pointer desktop:border-l even:pl-0 odd:pr-0 even:desktop:p-[30px] odd:desktop:p-[30px] border-black border-b aspect-[175/240] desktop:aspect-[385/440] w-full flex flex-col desktop:p-[30px] p-[20px]"
            >
              <ProductCard :product-group="product" />
            </div>
            <div
              v-else
              :class="[
                index == subcategory?.objects_on_page.length - 1 &&
                index % 2 == 0
                  ? 'col-span-2 !border-r-0 aspect-[350/240] desktop:col-span-1  px-0 desktop:p-[30px] aspect-[aspect-[385/440]:'
                  : '',
                index == subcategory?.objects_on_page.length - 1 ? '' : '',
              ]"
              class="cursor-pointer desktop:border-l odd:pl-0 even:pr-0 even:desktop:p-[30px] odd:desktop:p-[30px] border-black border-b aspect-[175/240] desktop:aspect-[385/440] w-full flex flex-col desktop:p-[30px] p-[20px]"
            >
              <ProductCard :product-group="product" />
            </div>
          </template>
        </div>
        <div
          class="overflow-auto border-black border col-start-4 row-start-1 desktop:block hidden bg-black-general content-start"
        >
          <Filters
            @preview="(filters) => fetchPages(filters)"
            @set-filters="(newFilters) => (filters = newFilters)"
            :count="productsAmount"
          />
        </div>
      </div>
      <div class="main-p-sides mt-[30px]">
        <vue-awesome-paginate
          class="font-TT desktop:mt-auto w-full"
          :total-items="pagesAmount"
          :items-per-page="1"
          v-model="currentPage"
          :show-breakpoint-buttons="!type"
        />
      </div>
    </div>
    <NewProducts class="mt-[50px]" />
    <div class="w-full flex">
      <div class="desktop:w-1/2 w-full aspect-[4/3] z-[0]">
        <Map />
      </div>
      <div class="w-1/2 hidden desktop:block aspect-[4/3]">
        <AboutVideo :showreel="false" />
      </div>
    </div>
  </div>
</template>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}

.paginate-buttons {
  height: 20px;
  width: 20px;
  cursor: pointer;
  background-color: white;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;
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
