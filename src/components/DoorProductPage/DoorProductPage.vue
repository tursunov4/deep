<script setup lang="ts">
import {ref} from "vue";

import createClient from "openapi-fetch";
import {components, paths} from "../../types/schema";
import {Ref, watch} from "vue";
import router from "../../router";
import FinishingMaterialsCarousel from "../Doors/FinishingMaterialsCarousel.vue";
import PhotoCarousel from "./PhotoCarousel.vue";
import AboutVideo from "../HomePage/AboutVideo.vue";
import NewProducts from "../HomePage/NewProducts.vue";
import {useI18n} from "vue-i18n";
import {AppStore} from "../../store/AppStore.ts";

const HOST = import.meta.env.VITE_HOST_NAME
const {GET} = createClient<paths>({baseUrl: HOST});
const App = AppStore()

const door: Ref<components["schemas"]["Door"] | undefined> = ref()
const materials: Ref<components["schemas"]["Cover"][]> = ref([])

async function fetchProduct() {
  const {data, error} = await GET("/api/doors/{id}/", {
    params: {
      path: {
        id: parseInt(router.currentRoute.value.params.id as string)
      }
    }
  })
  if (error) return
  door.value = data
}

async function fetchMaterials() {
  const {data, error} = await GET("/api/door-page/covers/", {})
  if (error) return
  materials.value = data
}


watch(() => router.currentRoute.value, () => {
  fetchProduct()
  fetchMaterials()
}, {immediate: true})


const handles = ref<components["schemas"]["HandlerLock"][]>([])

const handlesCollapsed = ref(true)

const {t} = useI18n({useScope: 'global'})

const handlesElement = ref<HTMLElement | undefined>()

async function fetchHandles() {
  const {data, error} = await GET('/api/door-page/handler_locks/', {})
  if (error || !data) return
  handles.value = data
}

fetchHandles()

function collapseSection(element: HTMLElement | undefined) {
  if (!element) return
  console.log(element)
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;

  // temporarily disable all css transitions
  var elementTransition = element.style.transition;
  element.style.transition = '';

  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function () {
    element.style.height = sectionHeight + 'px';
    element.style.transition = elementTransition;

    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function () {
      element.style.height = 0 + 'px';
    });
  });
}

function expandSection(element: HTMLElement | undefined) {
  console.log(element);
  if (!element) return;

  // Set the initial height to 0 to start the transition
  element.style.height = '0px';

  // Ensure the element has a CSS transition for height
  element.style.transition = 'height 0.3s ease'; // Adjust the duration and easing as needed

  // Trigger a reflow to ensure the height change is noticed by the browser
  element.offsetHeight; // This forces the browser to recognize the change

  // Set the height to the element's scroll height to expand it
  var sectionHeight = element.scrollHeight;
  element.style.height = sectionHeight + 'px';

  // Create a handler function for the transition end event
  function transitionEndHandler() {
    if (!element) return
    // Remove this event listener so it only gets triggered once
    element.removeEventListener('transitionend', transitionEndHandler);

    // Remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = '';
    element.style.transition = ''; // Optional: Remove transition if it's only for this purpose
  }

  // Add the event listener for the transition end
  element.addEventListener('transitionend', transitionEndHandler);

  // Mark the section as "currently not collapsed"
  element.setAttribute('data-collapsed', 'false');
}

</script>

<template>
  <div class="w-2/3 desktop:flex hidden gap-4 mt-[125px] pl-[30px] mb-[15px]"><span @click="router.push('/')"
                                                                                    class="cursor-pointer">{{
      t('breadcrumbs.home')
    }}</span><span>{{ t('breadcrumbs.categories') }}</span><span>{{ t('breadcrumbs.doors') }}</span>
  </div>
  <div class="desktop:flex">
    <div
        class="desktop:w-3/4 desktop:aspect-[3/2]  desktop:border-r desktop:border-b border-black desktop:p-[25px] desktop:pt-0 pt-0">
      <PhotoCarousel :images="door?.door_images ? [...door.door_images] : []"/>
    </div>
    <div
        class="desktop:w-1/4 flex flex-col desktop:aspect-[3/2] border-black desktop:border-b desktop:pb-4 desktop:pl-4 desktop:pt-0 p-[20px] pt-[26px]  desktop:pr-[30px]">
      <div class="font-bold font-TT hidden desktop:block leading-10 text-[40px]">{{ t('doors_page.preorder') }}</div>
      <div
          class="desktop:text-[70px] text-[40px] flex font-TT font-bold leading-none desktop:leading-[64px] break-words uppercase desktop:mt-[30px]">
        <div class="desktop:w-4/5 w-3/4">{{ App.language == 'ru' ? door?.rus_name : door?.eng_name }}</div>
        <div class="w-1/4 desktop:hidden text-[18px] leading-5">{{ t('doors_page.preorder') }}</div>
      </div>
      <div class="flex gap-6 desktop:mt-[52px] mt-[20px] desktop:mb-[32px] mb-[25px] desktop:w-1/2">
        <button
            class="border desktop:w-auto min-w-1/2 w-full hover:desktop:bg-black-general hover:desktop:text-white border-black flex justify-center whitespace-nowrap items-center title text-lg pt-1 desktop:min-w-[240px] h-[50px] px-3">
          {{ t('product_page.add_to_card') }}
        </button>
      </div>
      <div class="flex flex-col desktop:gap-4 gap-[25px]">
        <div class="title text-lg uppercase w-2/3 desktop:leading-[1.55rem]">
          {{ App.language == 'ru' ? door?.rus_title : door?.eng_title }}
        </div>
        <div class="w-[70%] leading-[14px] text-[12px]">{{
            App.language == 'ru' ? door?.rus_description : door?.eng_description
          }}
        </div>
      </div>
    </div>
  </div>
  <div class="w-full desktop:mb-[117px] mb-[60px] -mt-[20px] desktop:mt-0">
    <FinishingMaterialsCarousel/>
  </div>
  <div class="desktop:flex">
    <div
        class="desktop:w-1/2 desktop:pl-[30px] desktop:m-0 desktop:mr-0 border-black border-b desktop:border-0 pb-[20px] desktop:pb-0 desktop:pr-0 mx-[20px]">
      <div class="font-bold font-TT leading-10 text-[40px] uppercase desktop:w-[67%] w-[75%]">
        {{ App.language == 'ru' ? door?.rus_title : door?.eng_title }}
      </div>
    </div>
    <div
        class="desktop:w-1/2  desktop:pr-[30px] desktop:pt-0 pt-[27px] desktop:border-t border-black desktop:border-none">
      <div class="w-full desktop:border px-[20px] desktop:px-0 border-black desktop:flex flex-wrap">
        <div
            class="desktop:w-1/2 border-black desktop:border-r flex flex-col desktop:px-6 desktop:py-[18px] desktop:pr-[5px] gap-[12px]">
          <div class="hidden desktop:block text-[16px] font-ultra-condensed leading-[18px] uppercase">
            {{ t('doors_page.specifications.specifications') }}
          </div>
          <div class="flex flex-col gap-[35px]">
            <div class="flex -mb-[15px] gap-2">
              <div class="w-[56%] text-[12px] leading-[14px] text-[#828282]">
                {{ t('doors_page.specifications.performance') }}
              </div>
              <div class="w-[22%] text-[12px] leading-[14px]  min-w-[40px] break-words text-[#828282]">
                {{ t('doors_page.specifications.standard') }}
              </div>
              <div class="w-[22%]  text-[12px] leading-[14px] min-w-[32px] break-words text-[#828282]">
                {{ t('doors_page.specifications.request') }}
              </div>
            </div>
            <div v-for="spec in door?.door_specifications.slice(0, 4)" class="flex">
              <div class="w-[56%] font-TT  font-bold text-[16px] items-center gap-[5px] flex">
                <img :src="spec.image"
                     class="w-[40px] aspect-square"/>
                <div
                    class="block w-[calc(100%-50px)] uppercase break-words text-[15px] leading-[20px] tracking-[0.64px] -mt-[5px]">
                  {{ App.language == 'ru' ? spec.rus_performance : spec.eng_performance }}
                </div>
              </div>
              <div class="w-[22%] flex items-center">
                {{ App.language == 'ru' ? spec.rus_standard : spec.eng_standard }}
              </div>
              <div class="w-[22%] font-TT flex items-center">
                {{ App.language == 'ru' ? spec.rus_upon_request : spec.eng_upon_request }}
              </div>
            </div>
          </div>
        </div>
        <div
            class="desktop:w-1/2 border-black border-b desktop:border-b-0 py-[35px] flex flex-col desktop:px-6 desktop:py-[18px] desktop:pr-[5px] gap-[12px]">
          <div class="hidden desktop:opacity-0 desktop:block text-[16px] font-ultra-condensed leading-[18px] uppercase">
            {{ t('doors_page.specifications.specifications') }}
          </div>
          <div class="flex flex-col gap-[35px]">
            <div class="desktop:flex hidden -mb-[15px] gap-2">
              <div class="w-[56%] text-[12px] leading-[14px] text-[#828282]">
                {{ t('doors_page.specifications.performance') }}
              </div>
              <div class="w-[22%] text-[12px] leading-[14px]  min-w-[40px] break-words text-[#828282]">
                {{ t('doors_page.specifications.standard') }}
              </div>
              <div class="w-[22%]  text-[12px] leading-[14px] min-w-[32px] break-words text-[#828282]">
                {{ t('doors_page.specifications.request') }}
              </div>
            </div>
            <div v-for="spec in door?.door_specifications.slice(4)" class="flex">
              <div class="w-[56%] font-TT  font-bold text-[16px] items-center gap-[5px] flex">
                <img :src="spec.image"
                     class="w-[40px] aspect-square"/>
                <div
                    class="block w-[calc(100%-50px)] uppercase break-words text-[14px] leading-[20px] tracking-[0.64px] -mt-[5px]">
                  {{ App.language == 'ru' ? spec.rus_performance : spec.eng_performance }}
                </div>
              </div>
              <div class="w-[22%] flex items-center">
                {{ App.language == 'ru' ? spec.rus_standard : spec.eng_standard }}
              </div>
              <div class="w-[22%] font-TT flex items-center">
                {{ App.language == 'ru' ? spec.rus_upon_request : spec.eng_upon_request }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-full desktop:flex">
          <div
              class="table_bottom_left desktop:w-1/2 desktop:pl-[29px] pl-[10px] pr-[36px] desktop:border-r desktop:border-t border-black">
            <div v-if="door?.ru_pdf || door?.en_pdf" class="pdf_instruction w-full mt-[30px] mb-[29px]">
              <a :href="App.language == 'ru' && door?.ru_pdf ? door?.ru_pdf : (door?.en_pdf ?? '')"
                 class="title flex text-base" target="_blank">
                <div class="aspect-square self-start border border-black w-[60px]">
                  <div class=" w-[33px] h-full m-auto bg-contain bg-center bg-no-repeat bg-[url('./assets/PDF.png')]"/>
                </div>
                <div class="flex uppercase flex-col ml-[21px] ">
                  <div>{{ App.language == 'ru' ? door?.ru_pdf_name : door?.en_pdf_name }}
                  </div>
                  <div class="text-[14px] font-medium font-arial mt-[17px]">
                    PDF
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div
              class="desktop:w-1/2 py-[40px] pl-[10px] border-black border-t border-b desktop:border-b-0 desktop:p-6 uppercase font-TT text-[18px] font-bold">
            {{ door?.id_code }}
          </div>

        </div>
      </div>
      <div class="-mx-[20px] desktop:mx-0 border-b px-[20px] desktop:border-0 pb-[29px] desktop:p-0 border-black">
        <button v-if="door?.drawing"
                class="desktop:w-1/3 w-full block mt-[30px] h-10 title text-base border-black border desktop:float-right">
          <a :href="door?.drawing">
            {{ t('product_page.drawing') }}</a></button>
      </div>
    </div>
  </div>
  <div
      class="uppercase font-TT leading-10 text-[40px] desktop:mt-[80px] mt-[60px] mb-[30px] px-[20px] desktop:px-[30px] font-bold">
    {{ t('doors_page.handles') }}
  </div>
  <div v-if="door?.locks_handles && door?.locks_handles.length  > 0"
       class="border-black desktop:border border-b desktop:mx-[30px]">
    <div v-for="handle in [...handles].slice(0, 1)"
         class="desktop:grid justify-items-stretch content-stretch grid-cols-2">
      <div :style="{'background-image': `url(${handle.image})`}" class="bg-no-repeat desktop:w-auto desktop:aspect-auto w-full aspect-[416/214] bg-cover bg-center"/>
      <div
          class="desktop:px-[30px] px-[20px] py-[30px] break-words">
        <h3 class="font-TT font-bold text-[25px] uppercase desktop:text-[40px] mb-[40px]">
          {{ App.language == 'ru' ? handle?.name_ru : handle?.name_eng }}</h3>
        <div :class="[handlesCollapsed  ? 'border-b-0' : 'border-b']"
             class="font-TT font-normal border-black desktop:border-0 uppercase text-[25px] desktop:text-[40px] desktop:pb-0 pb-[20px] leading-7 desktop:leading-10 text-black/40">
          {{ App.language == 'ru' ? handle?.ru_description : handle?.eng_description }}
        </div>
      </div>
    </div>
    <div ref="handlesElement" class="section" :style="{'height': '0'}">
      <div v-for="(handle, index) in [...handles].slice(1)"
           class="desktop:grid content-stretch justify-items-stretch grid-cols-2">
        <div :style="{'background-image': `url(${handle.image})`}" class="bg-no-repeat desktop:w-auto desktop:aspect-auto w-full aspect-[416/214] bg-cover bg-center"/>
        <div
            class="desktop:px-[30px] px-[20px] py-[30px] break-words">
          <h3 class="font-TT font-bold uppercase text-[25px] desktop:text-[40px] mb-[40px]">
            {{ App.language == 'ru' ? handle?.name_ru : handle?.name_eng }}</h3>
          <div :class="[index === [...handles].slice(1).length - 1 ? 'border-b-0' : 'border-b']"
               class="font-TT font-normal uppercase text-[25px] border-black desktop:text-[40px] desktop:leading-10 leading-7 desktop:pb-0 pb-[20px] text-black/40">
            {{ App.language == 'ru' ? handle?.ru_description : handle?.eng_description }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="desktop:flex justify-center px-[20px] desktop:p-0">
    <button
        @click="handlesCollapsed ? expandSection(handlesElement) : collapseSection(handlesElement); handlesCollapsed = !handlesCollapsed"
        v-if="handles.length > 1"
        class="desktop:w-1/4 w-full h-[50px] font-TT font-bold desktop:h-[60px] mx-auto hover:desktop:bg-black-general text-[18px] hover:desktop:text-white  text-black uppercase border-black border mt-[30px]">
      {{ handlesCollapsed ? t('filter.show_all') : t('filter.hide') }}
    </button>
  </div>
  <NewProducts/>
  <div class="w-full flex desktop:aspect-auto aspect-[4/5]">
    <AboutVideo/>
  </div>
</template>

<style scoped>

</style>
