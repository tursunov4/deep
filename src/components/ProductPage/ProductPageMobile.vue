<script setup lang="ts">
import { computed, Ref, ref, watch } from "vue";
import NewProducts from "../HomePage/NewProducts.vue";
import AboutVideo from "../HomePage/AboutVideo.vue";
import MobilePhotoCarousel from "../MobilePhotoCarousel.vue";
import SeeAlso from "./SeeAlso.vue";
import { AppStore } from "../../store/AppStore.ts";
import { components } from "../../types/schema";
import { useI18n } from "vue-i18n";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import RelatedProducts from "../RelatedProducts.vue";
import { CartStore } from "../../store/CartStore.ts";
import router from "../../router";
import { HeaderStore } from "../../store/HeaderStore.ts";

const App = AppStore();
const Cart = CartStore();
const Header = HeaderStore();

const { t } = useI18n({ useScope: "global" });
const props = defineProps<{
  productGroup: components["schemas"]["AbstractProduct"];
  seeAlsoProducts: components["schemas"]["ObjsCollection"] | undefined;
  relatedProducts: components["schemas"]["PreviewAbstract"][] | undefined;
  collections: components["schemas"]["CountCollection"][] | undefined;
  colors: components["schemas"]["CountCollection"][] | undefined;
}>();

function goToCollection() {
  let collectionId = props.collections?.find(
    (collection) =>
      collection.eng_name == props.productGroup.eng_collection_name
  )?.id;
  if (collectionId) {
    Header.collections.selectedCollectionId = collectionId;
  }
}

const selected: Ref<number> = ref(0);

const selectedProduct: Ref<components["schemas"]["Product"] | undefined> =
  computed(() => {
    return props.productGroup.colored_products[selected.value];
  });

function addToCart() {
  let product = {
    product: props.productGroup.colored_products[selected.value],
    amount: 1,
  };
  Cart.products.push(product);
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
  <div v-if="selectedProduct" class="w-full flex flex-wrap">
    <!--    CAROUSEL     -->
    <div class="w-full border-black">
      <MobilePhotoCarousel :images="[...selectedProduct?.product_images]" />
    </div>
    <!--    END CAROUSEL     -->

    <div class="w-full p-[20px] flex flex-col">
      <!--    PRODUCT NAME     -->
      <div class="flex flex-col ml-[2px] leading-[43px]">
        <div class="title font-normal text-[40px]">
          {{
            App.language == "ru"
              ? selectedProduct.rus_name.toUpperCase()
              : selectedProduct.eng_name.toUpperCase()
          }}
        </div>
        <div
          class="text-[18px] uppercase font-TT text-[#101010] font-bold pl-[2px]"
        >
          id: {{ selectedProduct.id_code }}
        </div>
      </div>
      <!--    END PRODUCT NAME     -->

      <!--    COLORS     -->
      <div class="flex mt-4 overflow-x-auto max-w-full hide-scroll gap-[2px]">
        <div
          v-for="(product, index) in productGroup.colored_products"
          @click.stop="selected = index"
          class="flex flex-col max-w-[60px] text-center items-center"
        >
          <img
            :src="product.colour.photo"
            :class="{ border: index == selected }"
            class="border-black cursor-pointer min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] p-[4px]"
          />
          {{
            App.language == "ru"
              ? product.colour.rus_name
              : product.colour.eng_name
          }}
        </div>
      </div>

      <!--    END COLORS     -->

      <div class="flex flex-col gap-4 mt-[12px]">
        <!--    ADD TO CARD     -->
        <div class="flex items-center gap-6">
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
            class="border border-black flex h-[35px] justify-center items-center title text-lg w-full py-1"
          >
            {{ t("product_page.add_to_card") }}
          </button>
          <div v-else class="flex items-center gap-6 my-[20px]">
            <div class="desktop:mr-6 font-TT text-base font-semibold">
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
          </div>
        </div>
        <!--    END ADD TO CARD     -->

        <div class="title text-lg mt-[11px]">
          {{
            App.language == "ru"
              ? selectedProduct.rus_title.toUpperCase()
              : selectedProduct.eng_title.toUpperCase()
          }}
        </div>
        <div class="mt-[-12px]">
          {{
            App.language == "ru"
              ? selectedProduct.rus_description
              : selectedProduct.eng_description
          }}
        </div>
      </div>
    </div>

    <div class="m-[20px] mt-[15px] border-black w-full mb-[60px]">
      <Disclosure v-slot="{ open }">
        <DisclosureButton
          :class="open ? 'border-t border-black' : 'border-y border-black'"
          class="w-full duration-[1ms] py-[20px] flex items-center"
        >
          <div class="flex justify-start text-start text-[12px]">
            {{ t("product_page.about_product") }}
          </div>
          <div
            :class="open ? 'rotate-180 transform origin-center' : ''"
            class="inline-block ml-auto h-min min-h-0 duration-300"
          >
            <span class="gg-chevron-down" />
          </div>
        </DisclosureButton>
        <transition
          enter-active-class="transition-all duration-100 ease-out"
          enter-from-class=" -mt-6 opacity-0"
          enter-to-class=" -mt-0 opacity-100"
          leave-active-class="transition-all duration-100 ease-out"
          leave-from-class=" -mt-0 opacity-100"
          leave-to-class=" -mt-6 opacity-0"
        >
          <DisclosurePanel
            class="duration-[500ms] w-full border-black mt-[-10px]"
          >
            <div class="w-full">
              <div
                class="pr-[35px] font-TT uppercase text-base text-[#8B8B8B] text-[18px] leading-[23px] whitespace-pre-wrap"
              >
                {{
                  App.language == "ru"
                    ? selectedProduct.rus_care
                    : selectedProduct.eng_care
                }}
              </div>

              <div class="h-[0px] border-b border-black mt-[23px]"></div>

              <div
                v-if="selectedProduct.product_specifications.length > 0"
                class="w-full flex flex-col py-4 border-black mt-[10px] border-b"
              >
                <div class="mb-[14px]">
                  {{ t("product_page.specification") }}
                </div>
                <div
                  v-for="spec in selectedProduct.product_specifications"
                  class="flex title text-base justify-between mt-[-5px] leading-[28px]"
                >
                  <div>
                    {{
                      App.language == "ru"
                        ? spec.rus_name.toUpperCase()
                        : spec.eng_name.toUpperCase()
                    }}
                  </div>
                  <div>
                    {{
                      App.language == "ru"
                        ? spec.rus_value.toUpperCase()
                        : spec.eng_value.toUpperCase()
                    }}
                  </div>
                </div>
              </div>

              <div class="pdf_instruction w-full mt-[30px] mb-[25px]">
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
                    <div class="text-[14px] font-medium font-arial mt-[17px]">
                      PDF
                    </div>
                  </div>
                </a>
              </div>
              <!--    END INSTRUCTION PDF     -->

              <!--    FILE     -->
              <div
                v-if="
                  selectedProduct.ru_pdf_size_field ||
                  selectedProduct.en_pdf_size_field
                "
                class="pdf_instruction w-full"
              >
                <!--    DRAWING     -->
                <a
                  v-if="
                    !selectedProduct.flag_of_model &&
                    selectedProduct.ru_pdf &&
                    selectedProduct.en_pdf
                  "
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
                      class="w-[33px] h-full m-auto bg-contain bg-center bg-no-repeat bg-[url('./assets/PDF.png')]"
                    />
                  </div>
                  <div
                    v-if="
                      selectedProduct.ru_pdf_name && selectedProduct.en_pdf_name
                    "
                    class="flex flex-col ml-[21px]"
                  >
                    <div>
                      {{ t("product_page.drawing") }}
                    </div>
                    <div class="text-[14px] font-medium font-arial mt-[17px]">
                      PDF
                    </div>
                  </div>
                </a>
                <!--    END DRAWING     -->

                <!--    3D MODEL     -->
                <a
                  v-if="
                    selectedProduct.flag_of_model &&
                    selectedProduct.ru_pdf &&
                    selectedProduct.en_pdf
                  "
                  :href="
                    App.language == 'ru'
                      ? selectedProduct.ru_pdf
                      : selectedProduct.en_pdf
                  "
                  class="title flex text-base"
                  target="_blank"
                >
                  <div
                    class="aspect-square self-start border border-black w-[60px] p-[0px]"
                  >
                    <div
                      class="p-[0px] w-full h-full m-auto bg-cover bg-center bg-no-repeat bg-[url('./assets/3D_model.svg')]"
                    />
                  </div>
                  <div
                    v-if="
                      selectedProduct.ru_pdf_name && selectedProduct.en_pdf_name
                    "
                    class="flex flex-col ml-[21px]"
                  >
                    <div>
                      {{ t("product_page.3d") }}
                    </div>
                    <div class="text-[14px] font-medium font-arial mt-[17px]">
                      FBX
                    </div>
                  </div>
                </a>
                <!--    END 3D MODEL     -->
              </div>
              <!--    END FILE     -->
            </div>
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </div>

    <div
      v-if="relatedProducts && relatedProducts?.length > 0"
      class="w-full mt-[-10px] mb-[60px]"
    >
      <RelatedProducts
        v-if="relatedProducts && relatedProducts?.length > 0"
        :related="relatedProducts"
      />
    </div>

    <!--    SHOP BY COLORS     -->
    <div class="w-full px-4">
      <div class="border-b border-black">
        <div class="title text-[32px] uppercase leading-[43px]">
          {{
            App.language == "ru" ? productGroup.rus_name : productGroup.eng_name
          }}
        </div>
      </div>

      <div class="pb-6">
        <div class="">
          <div class="w-full flex border-black border-b flex-col py-4">
            <div class="mb-[10px]">
              {{ t("product_page.colors_materials") }}
            </div>

            <div
              @click="
                router.push({
                  path: '/sub-category/' + productGroup.eng_subcategory_name,
                  query: { color: color.id },
                })
              "
              v-for="color in colors"
              class="flex title text-[18px] justify-between"
            >
              <div class="uppercase">
                {{ App.language == "ru" ? color.rus_name : color.eng_name }}
              </div>
              <div>
                {{ color.count }}
              </div>
            </div>
          </div>

          <a
            v-if="
              selectedProduct.collection_file_ru ||
              selectedProduct.collection_file_eng
            "
            :href="
              App.language == 'ru'
                ? selectedProduct.collection_file_ru ?? ''
                : selectedProduct.collection_file_eng ?? ''
            "
            class="title flex text-base mt-[20px]"
            target="_blank"
          >
            <div class="aspect-square self-start border border-black w-[60px]">
              <div
                class="w-[33px] h-full m-auto bg-contain bg-center bg-no-repeat bg-[url('./assets/PDF.png')]"
              />
            </div>
            <div class="flex flex-col ml-[21px]">
              <div>{{ t("DEPP\nCOLLECTION") }}</div>
              <div class="text-[14px] font-medium font-arial mt-[17px]">
                PDF
              </div>
            </div>
          </a>
          <!--    END INSTRUCTION (PDF)    -->
        </div>
      </div>
    </div>

    <SeeAlso
      v-if="seeAlsoProducts && seeAlsoProducts?.products?.length > 0"
      :subcategory="productGroup.eng_subcategory_name"
      :see-also="seeAlsoProducts"
      class="mt-[30px]"
    />
    <NewProducts class="mt-[0px]" />
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
    class="flex text-white"
  >
    <div class="w-full flex relative items-center aspect-[39/16]">
      <img
        :src="seeAlsoProducts?.banner"
        class="object-cover w-full h-full -z-10 absolute"
      />
      <div class="main-p mx-auto">
        <div class="font-TT font-bold text-[18px] uppercase">
          {{
            App.language == "ru"
              ? productGroup.rus_collection_name
              : productGroup.eng_collection_name
          }}
        </div>
      </div>
    </div>
  </RouterLink>

  <div class="w-full flex desktop:aspect-auto aspect-[4/5]">
    <AboutVideo />
  </div>
</template>

<style scoped></style>
