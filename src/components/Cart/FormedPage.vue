<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "../../router";
import AboutVideo from "../HomePage/AboutVideo.vue";
import NewProducts from "../HomePage/NewProducts.vue";
import { useWindowWidth } from "../../composables/isDesktop.ts";
const { t } = useI18n({ useScope: "global" });

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

const { isDesktop } = useWindowWidth();
</script>

<template>
  <!--Прокручиваем страницу вверх-->
  {{ scrollToTop() }}

  <div class="w-full flex px-6">
    <div v-if="isDesktop" class="flex w-full">
      <div
        class="desktop:w-1/2 py-[1.8750vw] title hidden uppercase desktop:block text-[40px] leading-[40px]] text-5xl whitespace-pre-wrap"
      >
        <div>
          {{ t("cart.order_formed") }}
        </div>
      </div>
      <div class="desktop:w-1/2 w-full">
        <div id="product-list">
          <div
            class="flex font-TT font-normal text-[18px] pr-[29px] pt-[1.8750vw] pb-[1.5vw]"
          >
            <div class="whitespace-pre-wrap text-[#8B8B8B] text-[18px]">
              {{ t("cart.cart_empty_description").toUpperCase() }}
            </div>
          </div>

          <div
            class="desktop:py-6 font-bold border-t border-black desktop:text-[2.5vw] desktop:leading-[2.5vw] text-[10.2564vw] leading-[10.2564vw] font-TT"
          >
            {{ t("cart.order").toUpperCase() }} <br />
            №{{ new Date().getFullYear() }}—{{ Math.floor(Math.random() * 10)
            }}{{ Math.floor(Math.random() * 10)
            }}{{ Math.floor(Math.random() * 10) }}—DP
          </div>
        </div>
        <div
          @click="
            $emit('hideCart');
            router.push('/');
          "
          class="font-TT desktop:mt-[2vw] desktop:mb-[5vw] desktop:text-[1.1250vw] desktop:leading-[1.1250vw] desktop:w-[15vw] desktop:h-[3.1250vw] text-[4.6154vw] mt-[12.8205vw] mb-[20.5128vw] font-bold h-[10.2564vw] w-[89.7436vw] hover:bg-black hover:text-white flex justify-center items-center border border-black"
        >
          {{ t("cart.back_to_home").toUpperCase() }}
        </div>
      </div>
    </div>

    <div v-else>
      <div
        class="whitespace-pre-wrap text-[40px] leading-[40px] font-TT font-bold mt-[6.1538vw]"
      >
        {{ t("cart.order_formed").toUpperCase() }}
      </div>
      <div
        class="whitespace-pre-wrap text-[4.6154vw] leading-[4.6154vw] font-TT font-bold mt-[7vw]"
      >
        {{ t("cart.cart_empty_description").toUpperCase() }}
      </div>
      <div
        class="py-6 font-bold border-t border-black text-[10.2564vw] leading-[10.2564vw] font-TT mt-[7vw]"
      >
        {{ t("cart.order").toUpperCase() }} <br />
        №{{ new Date().getFullYear() }}—{{ Math.floor(Math.random() * 10)
        }}{{ Math.floor(Math.random() * 10)
        }}{{ Math.floor(Math.random() * 10) }}—DP
      </div>
      <div
        @click="
          $emit('hideCart');
          router.push('/');
        "
        class="font-TT text-[4.6154vw] mt-[2.8205vw] mb-[10.5128vw] font-bold h-[35px] cursor-pointer w-[89.7436vw] m-auto hover:bg-black hover:text-white flex justify-center items-center border border-black"
      >
        {{ t("cart.back_to_home").toUpperCase() }}
      </div>
    </div>
  </div>
  <NewProducts />
  <div class="desktop:aspect-video aspect-[4/5]">
    <AboutVideo />
  </div>
</template>

<style scoped></style>
