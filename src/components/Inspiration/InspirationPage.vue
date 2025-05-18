<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import router from "../../router";
import createClient from "openapi-fetch";
import {components, paths} from "../../types/schema";
import {AppStore} from "../../store/AppStore.ts";
import {useWindowWidth} from "../../composables/isDesktop.ts";
import ProductScroller from "../ProductScroller.vue";

const HOST = import.meta.env.VITE_HOST_NAME;
const {GET} = createClient<paths>({baseUrl: HOST});
const {t} = useI18n({useScope: "global"});
const App = AppStore();

type NearItems = {
  next: components["schemas"]["Inspiration"] | undefined;
  previous: components["schemas"]["Inspiration"] | undefined;
};

const {isDesktop} = useWindowWidth();

const inspiration = ref<components["schemas"]["Inspiration"] | undefined>();
const allInspirations = ref<components["schemas"]["PreviewInspiration"][]>([]);
const distributedImages = ref<components["schemas"]["PreviewInspiration"][][]>([])
const distributedImagesMobile = ref<components["schemas"]["PreviewInspiration"][][]>([])
const nearItems = ref<NearItems>({
  next: undefined,
  previous: undefined,
});

const imageElement = ref<HTMLImageElement | undefined>();

async function fetchInspiration() {
  const {data, error} = await GET("/api/inspiration/{id}/", {
    params: {
      path: {
        id: parseInt(router.currentRoute.value.params.id as string),
      },
    },
  });
  if (error) return;
  inspiration.value = data;
}

async function fetchAllInspiration() {
  const {data, error} = await GET("/api/inspiration/", {});
  if (error) return;
  allInspirations.value = data;
  distributeImages(data.slice(0,(isDesktop ? 20 : 10)), 4)
  distributeImages(data.slice(0,(isDesktop ? 20 : 10)), 2, true)
}

const getMeta = (url: string) => {
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img);
};

async function distributeImages(imageUrls: components["schemas"]["PreviewInspiration"][], columnCount: number, forMobile = false) {
  const columns: components["schemas"]["PreviewInspiration"][][] = Array.from({ length: columnCount }, () => []);
  const columnHeights = new Array(columnCount).fill(0);
  const filteredImages = imageUrls.filter(url => url.id.toString() !== router.currentRoute.value.params.id)
  const images = await Promise.all(
      filteredImages.map(url => getMeta(url.crop_image ?? url.image))
  );

  images.forEach((img, index) => {
    const smallestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    columnHeights[smallestColumnIndex] += img.naturalHeight / img.naturalWidth;
    columns[smallestColumnIndex].push(filteredImages[index]);
  });

  forMobile ? distributedImagesMobile.value = columns : distributedImages.value = columns
}

async function fetchNear() {
  {
    let {data, error} = await GET("/api/inspiration/next/{id}/", {
      params: {
        path: {
          id: router.currentRoute.value.params.id as string,
        },
      },
    });
    if (error) {
      nearItems.value.next = undefined;
    }
    nearItems.value.next = data;
  }
  {
    let {data, error} = await GET("/api/inspiration/prev/{id}/", {
      params: {
        path: {
          id: router.currentRoute.value.params.id as string,
        },
      },
    });
    if (error) {
      nearItems.value.previous = undefined;
    }
    nearItems.value.previous = data;
  }
}

const isZoomed = ref(false);
const showItems = ref(false);

watch(
    router.currentRoute,
    () => {
      inspiration.value = undefined;
      fetchInspiration();
      fetchNear();
    },
    {immediate: true}
);

const offset = reactive({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
});

let resizeTimeout: number | undefined;

const handleResize = () => {
  if (!imageElement.value) return;
  console.log(imageElement.value)
  offset.top = imageElement.value.offsetTop;
  offset.left = imageElement.value.offsetLeft;
  offset.width = imageElement.value.offsetWidth;
  offset.height = imageElement.value.offsetHeight;
};

const debouncedResizeHandler = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleResize, 300)
};

onMounted(() => {
  window.addEventListener("resize", debouncedResizeHandler);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", debouncedResizeHandler);
});

onMounted(fetchAllInspiration);
watch(imageElement, () => {
  handleResize();
});

watch(isZoomed, () => {
  if (isZoomed.value) {
    window.scrollTo({top: 0, left: 0, behavior: "smooth"});
  }
});

watch(router.currentRoute, () => {
  if (router.currentRoute.value.params.id) {
    distributeImages(allInspirations.value, 4)
    distributeImages(allInspirations.value, 2, true)
  }
})

</script>

<template>
  <div v-if="isZoomed && isDesktop" @click="isZoomed = false" class="absolute z-[10] pt-[140px] top-0 h-full w-full bg-black/40">
    <div class="relative">
      <img :src="inspiration?.image" class="w-full">
      <button @click="isZoomed = false"
              class="absolute top-[30px] z-40 right-[30px] close-zoom border-white border aspect-square w-[88px] h-[88px] font-light"></button>
    </div>
  </div>
  <div class="desktop:h-screen relative desktop:px-[30px] px-[20px] flex flex-col">
    <div
        class="mt-[130px] flex pb-[20px] desktop:pb-[15px] gap-4">
      <RouterLink to="/">{{ t('breadcrumbs.home') }}</RouterLink>
      <RouterLink to="/inspirations">{{ t('breadcrumbs.inspiration') }}</RouterLink>
    </div>
    <div v-if="nearItems.previous && isDesktop"
         @click="router.push({name:'inspiration-page', params: {id: nearItems.previous?.id}})"
         class="absolute z-[5] left-0 desktop:flex hidden items-center p-[30px] h-full cursor-pointer">
      <img src="../../assets/arrow-left.svg" class="w-[10px] h-[20px] object-contain rotate-180"/>
    </div>
    <div v-if="nearItems.next && isDesktop"
         @click="router.push({name:'inspiration-page', params: {id: nearItems.next?.id}})"
         class="absolute z-[5] right-0 desktop:flex hidden items-center p-[30px] h-full cursor-pointer">
      <img src="../../assets/arrow-left.svg" class="w-[10px] h-[20px]"/>
    </div>
    <div class="grow flex max-h-full relative max-w-full overflow-hidden">
      <div v-if="inspiration?.products_in.length" @click="showItems = !showItems"
           :class="showItems ? 'bg-white/80' : ''"
           class="absolute desktop:hidden crosshair shown bottom-[20px] left-[20px] w-[40px] h-[40px]">
        <div class="top-left-border absolute w-full h-full"/>
        <div class="bottom-right-border absolute w-full h-full"/>
      </div>
      <div class="grow flex justify-center items-center max-w-full max-h-full">
        <template v-for="item in inspiration?.products_in">
          <div v-if="item.colored_product && (isDesktop || showItems)"
               :style="{'left': `${offset.left - (isDesktop ? 44 : 20) + (offset.width *(item.x_coordinate / 100) )}px`,'top': `${offset.top - (isDesktop ? 44 : 20) + (offset.height * (item.y_coordinate / 100))}px`}"
               class="absolute crosshair flex group items-center w-[40px] h-[40px] desktop:w-[88px] desktop:h-[88px]">
            <div class="top-left-border absolute w-full h-full"/>
            <div class="bottom-right-border absolute w-full h-full"/>
            <div :class="[item.x_coordinate > 75 ? 'right-[0px] pr-[150px]' : 'left-[0px] pl-[150px]', { 'bottom-0': item.y_coordinate > 80}, { 'top-0': item.y_coordinate < 20}]"
                 class="w-[620px] h-[250px] hover:block group-hover:desktop:block hidden absolute">
              <div class="w-full h-full relative z-10 bg-white p-[30px] flex gap-[30px]">
                <img class="max-h-full aspect-square object-cover"
                     :src="item.colored_product.main_photo.photo"/>
                <div class="flex w-full flex-col gap-[20px]">
                  <div class="font-arial text-[12px]">
                    id {{ App.language == 'ru' ? item.colored_product.id : item.colored_product.id }}
                  </div>
                  <h2 class="font-TT font-bold text-[18px] uppercase">
                    {{
                      App.language == 'ru' ? item.abstract_product_preview.rus_name : item.abstract_product_preview.eng_name
                    }}</h2>
                  <div>
                    {{
                      App.language == 'ru' ? item.colored_product.rub_cost + '₽' : item.colored_product.euro_cost + '€'
                    }}
                  </div>
                  <router-link class="mt-auto" :to="'/product/' + item.abstract_product_preview.id">
                    <button
                        class="w-full uppercase h-[50px] hover:bg-black hover:text-white title text-base border-black border">
                      {{ t('inspiration.view') }}
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </template>
        <img @load="handleResize" ref="imageElement" @click="isZoomed = isDesktop" :src="inspiration?.image"
             class="hover:cursor-crosshair max-w-full max-h-full h-full object-contain">
      </div>
    </div>
    <div class="flex flex-col desktop:items-center mt-[20px] mb-[30px]">
      <div class="uppercase desktop:font-medium desktop:font-arial desktop:text-[12px] font-TT font-bold text-[18px] desktop:">{{App.language == 'ru' ? inspiration?.rus_name : inspiration?.eng_name}}</div>
    <div class="uppercase whitespace-pre-wrap desktop:text-center" v-html="App.language == 'ru' ? inspiration?.description_ru : inspiration?.description_eng"/>
    </div>
<!--      <template v-if="inspiration">
        <div
            class="desktop:px-[30px] px-[20px] relative flex justify-center items-start">
          <div v-if="inspiration.products_in.length" @click="showItems = !showItems"
               :class="showItems ? 'bg-white/80' : ''"
               class="absolute desktop:hidden crosshair shown bottom-[20px] left-[40px] w-[40px] h-[40px]">
            <div class="top-left-border absolute w-full h-full"/>
            <div class="bottom-right-border absolute w-full h-full"/>
          </div>
          <div v-if="nearItems.previous && isDesktop"
               @click="router.push({name:'inspiration-page', params: {id: nearItems.previous?.id}})"
               class="absolute left-0 desktop:flex hidden items-center p-[30px] h-full cursor-pointer">
            <img src="../../assets/arrow-left.svg" class="w-[10px] h-[20px] object-contain rotate-180"/>
          </div>
          <template v-for="item in inspiration.products_in">
            <div v-if="item.colored_product && (isDesktop || showItems)"
                 :style="{'left': `${offset.left - (isDesktop ? 44 : 20) + (offset.width *(item.x_coordinate / 100) )}px`,'top': `${offset.top - (isDesktop ? 44 : 20) + (offset.height * (item.y_coordinate / 100))}px`}"
                 class="absolute crosshair flex group items-center w-[40px] h-[40px] desktop:w-[88px] desktop:h-[88px]">
              <div class="top-left-border absolute w-full h-full"/>
              <div class="bottom-right-border absolute w-full h-full"/>
              <div :class="[item.x_coordinate > 75 ? 'right-[0px] pr-[150px]' : 'left-[0px] pl-[150px]']"
                   class="w-[620px] h-[250px] hover:block group-hover:desktop:block hidden absolute">
                <div class="w-full h-full relative z-10 bg-white p-[30px] flex gap-[30px]">
                  <img class="max-h-full aspect-square object-cover"
                       :src="item.colored_product.main_photo.photo"/>
                  <div class="flex w-full flex-col gap-[20px]">
                    <div class="font-arial text-[12px]">
                      id {{ App.language == 'ru' ? item.colored_product.id : item.colored_product.id }}
                    </div>
                    <h2 class="font-TT font-bold text-[18px] uppercase">
                      {{
                        App.language == 'ru' ? item.abstract_product_preview.rus_name : item.abstract_product_preview.eng_name
                      }}</h2>
                    <div>
                      {{
                        App.language == 'ru' ? item.colored_product.rub_cost + '₽' : item.colored_product.euro_cost + '€'
                      }}
                    </div>
                    <router-link class="mt-auto" :to="'/product/' + item.abstract_product_preview.id">
                      <button
                          class="w-full uppercase h-[50px] hover:bg-black hover:text-white title text-base border-black border">
                        {{ t('inspiration.view') }}
                      </button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="flex items-start justify-center overflow-hidden">
            <img @load="handleResize" ref="imageElement" @click="isZoomed = isDesktop" :src="inspiration?.image"
                 class="hover:cursor-crosshair object-contain max-w-full max-h-full object-top">
          </div>
          <div v-if="nearItems.next && isDesktop"
               @click="router.push({name:'inspiration-page', params: {id: nearItems.next?.id}})"
               class="absolute right-0 desktop:flex hidden items-center p-[30px] h-full cursor-pointer">
            <img src="../../assets/arrow-left.svg" class="w-[10px] h-[20px]"/>
          </div>
        </div>
        <div class="desktop:hidden px-[20px] mt-[30px]">
          <h1 class="font-TT text-18px uppercase">
            {{ App.language === 'ru' ? inspiration?.rus_name : inspiration?.eng_name }}</h1>
          <div v-html="App.language == 'ru' ? inspiration?.description_ru : inspiration?.description_eng"
               class="font-arial whitespace-pre-line"></div>

        </div>
      </template>
    </div>-->
  </div>
  <div v-if="inspiration?.products_in?.length">
    <div
        class="desktop:px-[30px] px-[20px] w-1/2 desktop:mt-[120px] mt-[60px] mb-[30px] uppercase leading-10 font-TT font-bold text-[40px]">
      {{ t('inspiration.on_photo') }}
    </div>
    <ProductScroller v-if="inspiration?.products_in"
                     :products="[...inspiration?.products_in]"/>
  </div>
  <div v-if="inspiration?.support_products_for?.length">
    <div
        class="desktop:px-[30px] px-[20px] w-1/2 desktop:mt-[120px] mt-[60px] mb-[30px] uppercase leading-10 font-TT font-bold text-[40px]">
      {{ t('inspiration.related') }}
    </div>
    <ProductScroller v-if="inspiration?.support_products_for"
                     :products="[...inspiration?.support_products_for]"/>
  </div>
  <div>
    <div class="flex gap-[20px] main-p-sides border-black border-t desktop:mt-[60px] mt-[40px] desktop:pt-[40px] pt-[20px]">
    <div
        class="grid grid-cols-2 desktop:grid-cols-4 gap-[20px] w-full">
      <div v-for="column in (isDesktop ? distributedImages : distributedImagesMobile)">
        <div v-for="image in column"  @click="router.push({name: 'inspiration-page', params: {id: image.id}})" class="w-full cursor-pointer inline-block desktop:mb-[20px] mb-[30px] column-item">
          <div class="relative w-full group">
            <div
                class="absolute hidden opacity-0 group-hover:opacity-100 uppercase w-full font-bold text-white font-TT text-[18px] p-[30px] desktop:flex items-end h-full transition-all duration-300 bg-black-general/40">
              {{ App.language == 'ru' ? image.rus_name : image.eng_name }}
            </div>
            <img :src="image.crop_image ?? image.image" class="w-full h-auto">
            <div class="desktop:hidden font-normal text-[12px] mt-[10px] uppercase">
              {{ App.language == 'ru' ? image.rus_name : image.eng_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div class="desktop:mx-[30px] mx-[20px] flex justify-center desktop:my-[80px] mt-[40px] mb-[60px]">
      <RouterLink to="/inspirations" class="w-full desktop:w-auto">
        <button
            class="hover:bg-black-general h-[50px] desktop:w-[240px] w-full tracking-[0.56px]  font-TT font-bold text-[18px] hover:text-white  aspect-[325/60] text-black uppercase border-black border mt-[30px]">
          {{ t('filter.show_all') }}
        </button>
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>
.close-zoom {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
}

.close-zoom:hover {
  background-color: white;
}

.close-zoom:before, .close-zoom:after {
  position: absolute;
  content: ' ';
  height: 30px;
  border-radius: 2px;
  width: 2px;
  background-color: white;
}

.close-zoom:hover:before, .close-zoom:hover:after {
  position: absolute;
  content: ' ';
  height: 30px;
  border-radius: 2px;
  width: 2px;
  background-color: black;
}

.close-zoom:before {
  transform: rotate(45deg);
}

.close-zoom:after {
  transform: rotate(-45deg);
}

.top-left-border::before,
.top-left-border::after {
  transition: all 0.3s ease;
  z-index: 1;
  content: '';
  position: absolute;
  background-color: rgba(152, 127, 127, 0.4); /* Adjust color as needed */
  backdrop-filter: invert(100%);
}

.top-left-border::before {
  top: 0;
  left: 2px;
  width: calc(100% - 4px);
  height: 2px; /* Adjust height as needed */
}

.top-left-border::after {
  top: 0;
  left: 0;
  width: 2px; /* Adjust width as needed */
  height: 100%;
}

.bottom-right-border::before,
.bottom-right-border::after {
  z-index: 1;
  transition: all 0.3s ease;
  content: '';
  position: absolute;
  background-color: rgba(152, 127, 127, 0.4); /* Adjust color as needed */
  backdrop-filter: invert(1);
}

.bottom-right-border::before {
  bottom: 0;
  left: 2px;
  width: calc(100% - 4px);
  height: 2px; /* Adjust height as needed */
}

.bottom-right-border::after {
  top: 0;
  right: 0;
  width: 2px; /* Adjust width as needed */
  height: 100%;
}


.crosshair::before,
.crosshair::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px; /* Adjust to make it 2px thicker */
  height: 1px;
  background-color: rgba(152, 127, 127, 0.0); /* Adjust color as needed */
  backdrop-filter: invert(100%);
  opacity: 0;
  transition: opacity 0.3s ease; /* Smooth transition */
}

.crosshair::before {
  transform: translateX(-50%);
}

.crosshair::after {
  transform: translateX(-50%) rotate(90deg);
}

.crosshair.shown:before, .crosshair.shown:after {
  opacity: 1;
}


@media (min-width: 1100px) {

  .crosshair:hover::before,
  .crosshair:hover::after {
    opacity: 1;
  }

  .crosshair:hover .top-left-border::before {
    left: -50%;
    top: -50%;
  }

  .crosshair:hover .top-left-border::after {
    left: -50%;
    top: -50%;
  }

  .crosshair:hover .bottom-right-border::before {
    bottom: -50%;
    left: calc(50% + 4px);
  }

  .crosshair:hover .bottom-right-border::after {
    right: -50%;
    top: 50%;
  }
}

</style>
