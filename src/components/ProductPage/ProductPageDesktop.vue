<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { vOnClickOutside } from "@vueuse/components";
const { t } = useI18n({ useScope: "global" });
import PhotoCarousel from "../PhotoCarousel.vue";
import { computed, Ref, ref, watch } from "vue";
import NewProducts from "../HomePage/NewProducts.vue";
import AboutVideo from "../HomePage/AboutVideo.vue";
import { components } from "../../types/schema";
import { AppStore } from "../../store/AppStore.ts";
import SeeAlso from "./SeeAlso.vue";
import router from "../../router";
import RelatedProducts from "../RelatedProducts.vue";
import { CartStore } from "../../store/CartStore.ts";
import { HeaderStore } from "../../store/HeaderStore.ts";

const navigateTo = (path: string) => {
  router.push(path);
};

type Sections = "returns" | "tech" | "shipping" | "support" | null;
type Info = {
  section: Sections;
  clicked: boolean;
};

const selectedInfo = ref<Info>({
  section: null,
  clicked: false,
});

const App = AppStore();
const Cart = CartStore();
const Header = HeaderStore();
const props = defineProps<{
  productGroup: components["schemas"]["AbstractProduct"];
  relatedProducts: components["schemas"]["PreviewAbstract"][] | undefined;
  collections: components["schemas"]["CountCollection"][] | undefined;
  seeAlsoProducts: components["schemas"]["ObjsCollection"] | undefined;
  colors: components["schemas"]["CountCollection"][] | undefined;
}>();

const selected: Ref<number> = ref(0);

const selectedProduct: Ref<components["schemas"]["Product"] | undefined> =
  computed(() => {
    return (
      props.productGroup.colored_products[selected.value] ??
      props.productGroup.colored_products[0]
    );
  });

function addToCart() {
  let product = {
    product: props.productGroup.colored_products[selected.value],
    amount: 1,
  };
  Cart.products.push(product);
}

function goToCollection() {
  let collectionId = props.collections?.find(
    (collection) =>
      collection.eng_name == props.productGroup.eng_collection_name
  )?.id;
  if (collectionId) {
    Header.collections.selectedCollectionId = collectionId;
  }
}

watch(
  () => props.productGroup,
  () => {
    let prodIndex = props.productGroup.colored_products.findIndex(
      (product) =>
        product.id ==
        parseInt(router.currentRoute.value?.query?.color as string)
    );
    selected.value = prodIndex > 0 ? prodIndex : 0;
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="selectedProduct" class="w-full flex flex-wrap mt-44">
    <div class="w-full relative flex">
      <div
        class="w-1/2 aspect-square border-r border-b border-black pb-[35px] pl-[30px] pr-[1.575vw]"
      >
        <PhotoCarousel :images="[...selectedProduct.product_images]" />
      </div>

      <div
        class="w-1/2 flex flex-col pb-[30px] justify-between aspect-square border-black border-b main-p-sides pt-0"
      >
        <div>
          <div
            class="title font-normal text-[40px] font-TT uppercase leading-[1.05] mt-[2px]"
          >
            {{
              App.language == "ru"
                ? productGroup.rus_name
                : productGroup.eng_name
            }}
          </div>
          <div class="font-bold font-TT text-[18px] text-black uppercase">
            артикул товара: {{ selectedProduct.id_code }}
          </div>
          <!--end product name-->

          <!--colors-->
          <div class="flex gap-[4px] mt-[37px] mb-[31px]">
            <div
              v-for="(product, index) in productGroup.colored_products"
              @click.stop="selected = index"
              class="text-center font-TT text-[0.875rem] font-bold w-[4.375rem]"
            >
              <img
                :src="product.colour.photo"
                :class="{ 'border border-black': index == selected }"
                class="w-[4.375rem] h-[4.375rem] z-10 p-[4px] mb-[5px] object-fill self-end aspect-square"
                alt=""
              />
              {{
                App.language == "ru"
                  ? product.colour.rus_name.toUpperCase()
                  : product.colour.eng_name.toUpperCase()
              }}
            </div>
          </div>
          <!--end colors-->

          <!--add to card-->
          <div class="flex justify-end items-center gap-6 w-full">
            <div class="title text-[18px]">
              {{
                App.language == "ru"
                  ? selectedProduct.rub_cost + "₽"
                  : selectedProduct.euro_cost + "€"
              }}
            </div>

            <button
              v-if="
                !Cart.products.find(
                  (product) => product.product.id === selectedProduct?.id
                )
              "
              @click="addToCart"
              class="border cursor-pointer border-black flex justify-center whitespace-nowrap items-center title text-lg pt-1 min-w-[240px] h-[35px] px-3"
            >
              {{ t("product_page.add_to_card") }}
            </button>
            <div v-else class="flex items-center h-[35px]">
              <div class="desktop:mr-6 w-3 font-TT text-base font-semibold">
                {{
                  Cart.products.find(
                    (product) => product.product.id === selectedProduct?.id
                  )?.amount
                }}
              </div>
              <div
                @click="Cart.changeAmount(selectedProduct?.id, false)"
                class="desktop:mr-3 flex hover:bg-black hover:text-white text-3xl font-light w-[35px] h-[35px] border-black border items-center before:content-[''] before:w-1/2 before:bg-black before:h-[2px] hover:before:bg-white justify-center"
              ></div>
              <div
                @click="Cart.changeAmount(selectedProduct?.id, true)"
                class="flex relative hover:bg-black hover:text-white text-3xl font-light w-[35px] h-[35px] border-black border items-center justify-center before:content-[''] before:w-1/2 before:absolute before:bg-black before:h-[2px] hover:before:bg-white after:content-[''] after:w-1/2 after:bg-black after:h-[2px] hover:after:bg-white after:rotate-90"
              ></div>
              <button
                class="border ml-5 uppercase cursor-pointer border-black flex justify-center whitespace-nowrap items-center title text-lg pt-1 min-w-[157px] h-[35px] px-3"
                @click="navigateTo('/cart')"
              >
                в корзину
              </button>
            </div>
          </div>
        </div>

        <div>
          <!--title and description-->
          <div class="flex flex-col gap-4 mt-[42px]">
            <div class="title text-[18px] leading-[22.5px] w-full">
              {{
                App.language == "ru"
                  ? selectedProduct.rus_title.toUpperCase()
                  : selectedProduct.eng_title.toUpperCase()
              }}
            </div>
            <div class="leading-[13.8px]">
              {{
                App.language == "ru"
                  ? selectedProduct.rus_description
                  : selectedProduct.eng_description
              }}
            </div>
          </div>
          <!--end title and description-->

          <div class="border border-black mt-[50px]">
            <div
              v-on-click-outside="
                () => {
                  (selectedInfo.section = null), (selectedInfo.clicked = false);
                }
              "
              :class="{ '': selectedInfo.section }"
              class="h-[100px] text-[12px] text-[#6D6D6D] duration-150 transition-all font-arial px-[30px] py-[24px]"
            >
              <div class="w-full h-full overflow-hidden overflow-ellipsis">
                <template v-if="selectedInfo.section === 'tech'">{{
                  App.language == "ru"
                    ? selectedProduct.guarantee_ru
                    : selectedProduct.guarantee_eng
                }}</template>
                <template v-if="selectedInfo.section === 'shipping'">{{
                  App.language == "ru"
                    ? selectedProduct.delivery_ru
                    : selectedProduct.delivery_eng
                }}</template>
                <template v-if="selectedInfo.section === 'support'">{{
                  App.language == "ru"
                    ? selectedProduct.support_ru
                    : selectedProduct.support_eng
                }}</template>
                <template v-if="selectedInfo.section === 'returns'">{{
                  App.language == "ru"
                    ? selectedProduct.refund_ru
                    : selectedProduct.refund_eng
                }}</template>
              </div>
            </div>
            <div class="flex flex-grow justify-between items-end">
              <div
                :class="{
                  'font-bold text-[14px]  text-black border-t border-black underline-offset-[16px]':
                    selectedInfo.section === 'tech',
                }"
                class="px-[30px] duration-150 transition-all py-[12px] font-bold text-[14px] uppercase text-[#6D6D6D] cursor-pointer"
                @mouseleave="
                  selectedInfo.clicked ? null : (selectedInfo.section = null)
                "
                @mouseover="
                  selectedInfo.clicked ? null : (selectedInfo.section = 'tech')
                "
                @click="
                  selectedInfo.section = 'tech';
                  selectedInfo.clicked = true;
                "
              >
                {{ t("product_page.guarantee") }}
              </div>
              <div
                :class="{
                  'font-bold text-[14px]  text-black border-t border-black underline-offset-[16px]':
                    selectedInfo.section === 'shipping',
                }"
                class="px-[30px] duration-150 transition-all py-[12px] font-bold text-[14px] uppercase text-[#6D6D6D] cursor-pointer"
                @mouseleave="
                  selectedInfo.clicked ? null : (selectedInfo.section = null)
                "
                @mouseover="
                  selectedInfo.clicked
                    ? null
                    : (selectedInfo.section = 'shipping')
                "
                @click="
                  selectedInfo.section = 'shipping';
                  selectedInfo.clicked = true;
                "
              >
                {{ t("product_page.shipping") }}
              </div>
              <div
                :class="{
                  'font-bold text-[14px]  text-black border-t border-black underline-offset-[16px]':
                    selectedInfo.section === 'support',
                }"
                class="px-[30px] duration-150 transition-all py-[12px] font-bold text-[14px] uppercase text-[#6D6D6D] cursor-pointer"
                @mouseleave="
                  selectedInfo.clicked ? null : (selectedInfo.section = null)
                "
                @mouseover="
                  selectedInfo.clicked
                    ? null
                    : (selectedInfo.section = 'support')
                "
                @click="
                  selectedInfo.section = 'support';
                  selectedInfo.clicked = true;
                "
              >
                {{ t("product_page.support") }}
              </div>
              <div
                :class="{
                  'font-bold text-[14px]  text-black border-t border-black underline-offset-[16px]':
                    selectedInfo.section === 'returns',
                }"
                class="px-[30px] duration-150 transition-all py-[12px] font-bold text-[14px] uppercase text-[#6D6D6D] cursor-pointer"
                @mouseleave="
                  selectedInfo.clicked ? null : (selectedInfo.section = null)
                "
                @mouseover="
                  selectedInfo.clicked
                    ? null
                    : (selectedInfo.section = 'returns')
                "
                @click="
                  selectedInfo.section = 'returns';
                  selectedInfo.clicked = true;
                "
              >
                {{ t("product_page.returns") }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end right part of product view-->
    </div>
    <!--end product view-->

    <div class="w-full mt-[10px]">
      <RelatedProducts
        v-if="relatedProducts && relatedProducts?.length > 0"
        :related="relatedProducts"
      />
    </div>

    <div class="spec_part mt-[50px] border-t border-b border-black w-full flex">
      <div
        class="left flex flex-col justify-between w-1/2 border-r border-black"
      >
        <div class="title pl-[30px] pt-[35px] text-[40px] leading-[1.1]">
          {{ t("product_page.tech").toUpperCase() }}
        </div>
        <div class="table_bottom pl-[30px] border-t border-black w-full flex">
          <div
            class="table_bottom_left flex justify-between gap-[36px] pr-[36px]"
          >
            <div class="pdf_instruction mt-[30px] mb-[29px]">
              <a
                v-if="selectedProduct.ru_pdf && selectedProduct.en_pdf"
                :href="
                  App.language == 'ru'
                    ? selectedProduct.ru_pdf
                    : selectedProduct.en_pdf
                "
                class="title flex text-base"
                target="_blank"
              >
                <div
                  class="aspect-square self-start border border-black w-[60px]"
                >
                  <div
                    class="w-[33px] h-full m-auto bg-contain bg-center bg-no-repeat bg-[url('./assets/instruct.svg')]"
                  />
                </div>
                <div
                  v-if="
                    selectedProduct.ru_pdf_name && selectedProduct.en_pdf_name
                  "
                  class="flex flex-col ml-[21px]"
                >
                  <div>
                    {{
                      App.language == "ru"
                        ? selectedProduct.ru_pdf_name.toUpperCase()
                        : selectedProduct.en_pdf_name.toUpperCase()
                    }}
                  </div>
                  <div
                    class="text-[12px] text-[#101010] font-medium font-arial mt-[17px]"
                  >
                    PDF
                  </div>
                </div>
              </a>
            </div>
            <div class="pdf_instruction mt-[30px] mb-[29px]">
              <a
                v-if="selectedProduct.drawing_ru && selectedProduct.drawing_eng"
                :href="
                  App.language == 'ru'
                    ? selectedProduct.drawing_ru
                    : selectedProduct.drawing_eng
                "
                class="title flex text-base"
                target="_blank"
              >
                <div
                  class="aspect-square self-start border border-black w-[60px]"
                >
                  <div
                    class="w-[33px] h-full m-auto bg-contain bg-center bg-no-repeat bg-[url('./assets/PDF.png')]"
                  />
                </div>
                <div class="flex flex-col ml-[21px]">
                  <div>
                    {{ t("product_page.drawing") }}
                  </div>
                  <div
                    class="text-[12px] text-[#101010] font-medium font-arial mt-[17px]"
                  >
                    PDF
                  </div>
                </div>
              </a>
            </div>
            <div v-if="selectedProduct.flag_of_model" class="w-1/2 mr-[30px]">
              <button
                v-if="selectedProduct.drawing_ru"
                class="min-w-[240px] h-[50px] mt-[30px] hover:bg-black hover:text-white title text-base border-black border float-right"
              >
                <a
                  :href="
                    App.language == 'ru'
                      ? selectedProduct.drawing_ru ?? ''
                      : selectedProduct.drawing_eng ?? ''
                  "
                  target="_blank"
                  class="w-full h-full flex items-center justify-center"
                  >{{ t("product_page.3d") }}</a
                >
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="right w-1/2 pr-[30px]">
        <div class="right_table w-full border-black">
          <div class="table_top w-full flex border-black">
            <div
              class="table_top_left w-1/2 pt-[31px] pl-[29px] pr-[36px] border-r border-black"
            >
              <div class="care w-full text-[12px] text-[#101010]">
                {{ t("product_page.care") }}
              </div>
              <div
                class="description w-full font-TT text-[18px] leading-[24px] uppercase text-[#8B8B8B] mt-[29px] mb-[8px] whitespace-pre-wrap"
              >
                {{
                  App.language == "ru"
                    ? selectedProduct.rus_care
                    : selectedProduct.eng_care
                }}
              </div>
            </div>
            <div class="table_top_right w-1/2 pt-[31px] pl-[29px] pr-[36px]">
              <div class="spec w-full text-[12px] text-[#101010]">
                {{ t("product_page.specification") }}
              </div>
              <div class="prop w-full mt-[28px] mb-[20px]">
                <div
                  v-for="spec in selectedProduct.product_specifications"
                  class="title leading-[22px] uppercase text-[#8B8B8B] border-b border-[#E0E0E0] gap-1 text-[18px] font-normal items-stretch justify-between flex mb-[7px]"
                >
                  <div class="max-w-[140px] h-full -mb-[6px]">
                    <span class="bg-white pr-3">{{
                      App.language == "ru"
                        ? spec.rus_name.toUpperCase()
                        : spec.eng_name.toUpperCase()
                    }}</span>
                  </div>
                  <div
                    class="text-end leading-[22px] uppercase flex items-end justify-end -mb-[6px] max-w-[120px]"
                  >
                    <span class="pl-3 bg-white text-end">{{
                      App.language == "ru"
                        ? spec.rus_value.toUpperCase()
                        : spec.eng_value.toUpperCase()
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full mt-[10px]">
      <SeeAlso
        v-if="seeAlsoProducts && seeAlsoProducts?.products?.length > 0"
        :subcategory="productGroup.eng_subcategory_name"
        :see-also="seeAlsoProducts"
      />
    </div>
    <div class="w-full">
      <NewProducts />
    </div>
  </div>

  <RouterLink
    @click="goToCollection"
    :to="{
      path: '/collections',
      query: {
        collection: collections?.find(
          (collection) =>
            collection.eng_name == productGroup.eng_collection_name
        )?.id,
      },
    }"
    class="flex cursor-pointer text-white w-full aspect-[5/1]"
  >
    <div class="w-full relative">
      <img :src="seeAlsoProducts?.banner" class="w-full h-full object-cover" />
      <div>
        <div
          class="absolute bottom-[64px] left-[31px] title text-[40px] text-white"
        >
          {{
            App.language == "ru"
              ? seeAlsoProducts?.rus_name
              : seeAlsoProducts?.eng_name
          }}
        </div>
        <div
          class="absolute bottom-[31px] left-[31px] font-arial text-[12px] text-white"
        >
          {{
            collections?.find(
              (collection) =>
                collection.eng_name == productGroup.eng_collection_name
            )?.count
          }}
        </div>
      </div>
    </div>
  </RouterLink>
  <div class="w-full flex">
    <AboutVideo />
  </div>
</template>

<style scoped></style>
