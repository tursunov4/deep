<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import CartProducts from "./CartProducts.vue";
import PlaceOrder from "./PlaceOrder.vue";
import router from "../../router";
import { CartStore } from "../../store/CartStore.ts";
import { useI18n } from "vue-i18n";
import createClient from "openapi-fetch";
import { paths } from "../../types/schema";
import FormedPage from "./FormedPage.vue";
import { useWindowWidth } from "../../composables/isDesktop.ts";

defineProps<{
  cartVisible: boolean;
}>();

const HOST = import.meta.env.VITE_HOST_NAME;
const { POST } = createClient<paths>({ baseUrl: HOST });

const { t } = useI18n({ useScope: "global" });

type PersonalInfo = {
  first_name: string;
  second_name: string;
  patronymic: string;
  email: string;
  phone: string;
  delivery_type: string;
  country: string;
  city: string;
  street_name: string;
  zip_code: string;
  comment: string;
  base64_data: string;
};

type Steps = "cart" | "order" | "formed";
const emits = defineEmits(["hideCart"]);

const Cart = CartStore();

const step: Ref<Steps> = ref("cart");
let cart_cleared = 0;
const top = ref(null);
let fileString: string = "";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function goToOrder(form: string) {
  fileString = form;
  scrollToTop();
  step.value = "order";
}

watch(router.currentRoute, () => {
  emits("hideCart");
});

async function sendOrder(info: PersonalInfo) {
  let serialize = fileString.split(",")[1];
  if (!serialize) return;
  info.base64_data = serialize;
  if (!info.base64_data) return;
  let { error, response } = await POST("/api/upload_order_pdf/", {
    body: info,
  });
  if (error) return;
  if (response.status == 204) {
    Cart.clearCart();
    cart_cleared = 1;
    // router.push('/')
    // emits('hideCart')
    step.value = "formed";
  }
}

const { isDesktop } = useWindowWidth();
</script>

<template>
  <div class="w-full h-full bg-white">
    <div
      ref="top"
      class="flex flex-col items-center desktop:mt-[155px] mt-[120px] desktop:mb-[45px] mb-[50px]"
    >
      <div class="flex flex-col gap-[10px] items-center mx-auto my-auto">
        <h1 class="title text-center desktop:text-[40px] uppercase text-[40px]">
          {{ t("cart.cart") }}
        </h1>
        <div
          class="desktop:text-[18px] fonnt-bold text-[18px] uppercase desktop:block text-[10px] font-TT font-bold text-center"
        >
          товары
        </div>
      </div>
    </div>

    <!--Отрисовка верхней шапки для мобильной версии-->
    <div
      class="desktop:hidden font-TT font-bold p-6 flex justify-between items-center text-[3.5897vw] leading-[4.4872vw] border-b border-black"
    >
      <div>
        {{ step != "formed" ? t("cart.check_order") : t("cart.cart") }}
      </div>
      <div
        @click="Cart.clearCart()"
        v-if="step == 'cart'"
        class="cursor-pointer"
        :class="{
          'text-[#8B8B8B]':
            Cart.products.reduce((sum, product) => sum + product.amount, 0) ==
            0,
        }"
      >
        {{ t("cart.delete_all") }}
      </div>
    </div>

    <div class="p-6 desktop:p-0">
      <div class="w-full font-TT text-base flex border-y border-black">
        <div
          v-if="step != 'formed'"
          @click="step = 'cart'"
          :class="{ 'bg-black text-white': step == 'cart' }"
          class="desktop:w-1/4 desktop:text-[0.8750vw] text-[3.5897vw] desktop:leading-[1.0938vw] leading-[4.4872vw] font-bold font-TT w-full border-black border-x desktop:h-[5vw] min-h-10 text-center justify-center desktop:justify-start desktop:px-6 px-3 py-2 flex items-center"
        >
          <span class="mt-[0.5128vw] desktop:mt-[0.1250vw]">
            {{ t("cart.cart") }}
          </span>
        </div>
        <div
          v-else-if="isDesktop"
          class="desktop:w-1/4 desktop:text-[0.8750vw] text-[3.5897vw] desktop:leading-[1.0938vw] leading-[4.4872vw] font-bold font-TT w-full border-black border-x desktop:h-[5vw] min-h-10 text-center justify-center desktop:justify-start desktop:px-6 px-3 py-2 flex items-center"
        >
          <span
            class="mt-[0.5128vw] desktop:mt-[0.1250vw]"
            :class="{ 'text-[#8B8B8B]': step == 'formed' }"
          >
            {{ t("cart.cart") }}
          </span>
        </div>

        <div
          v-if="
            Cart.products.reduce((sum, product) => sum + product.amount, 0) > 0
          "
          @click="step = 'order'"
          :class="{ 'bg-black text-white': step == 'order' }"
          class="desktop:w-1/4 desktop:text-[0.8750vw] text-[3.5897vw] desktop:leading-[1.0938vw] leading-[4.4872vw] font-bold font-TT w-full border-black border-r desktop:h-[5vw] min-h-10 text-center justify-center desktop:justify-start desktop:px-6 px-3 py-2 flex items-center"
        >
          <span class="mt-[0.5128vw] desktop:mt-[0.1250vw]">
            {{ t("cart.place_order") }}
          </span>
        </div>
        <div
          v-else-if="isDesktop"
          class="desktop:w-1/4 desktop:text-[0.8750vw] text-[3.5897vw] desktop:leading-[1.0938vw] leading-[4.4872vw] font-bold font-TT w-full border-black border-r desktop:h-[5vw] min-h-10 text-center justify-center desktop:justify-start desktop:px-6 px-3 py-2 flex items-center"
        >
          <span class="mt-[0.5128vw] desktop:mt-[0.1250vw] text-[#8B8B8B]">
            {{ t("cart.place_order") }}
          </span>
        </div>
        <div
          v-else-if="step != 'cart'"
          class="bg-black text-white border-l desktop:w-1/4 text-[3.5897vw] leading-[4.4872vw] font-bold font-TT w-full border-black border-r min-h-10 text-center justify-center px-3 py-2 flex items-center"
        >
          <span class="mt-[0.5128vw]">
            {{ t("cart.check_order") }}
          </span>
        </div>

        <div
          class="desktop:w-1/2 desktop:text-[0.8750vw] text-[3.5897vw] desktop:leading-[1.0938vw] leading-[4.4872vw] font-bold font-TT hidden px-6 desktop:flex justify-between items-center"
          :class="{ 'bg-black text-white': step == 'formed' }"
        >
          <div
            :class="
              {
                'text-[#8B8B8B]':
                  Cart.products.reduce(
                    (sum, product) => sum + product.amount,
                    0
                  ) == 0,
              } && step != 'formed'
            "
          >
            {{ t("cart.check_order") }}
          </div>
          <div
            @click="Cart.clearCart()"
            v-if="
              step == 'cart' &&
              Cart.products.reduce((sum, product) => sum + product.amount, 0) >
                0
            "
            class="cursor-pointer"
          >
            {{ t("cart.delete_all") }}
          </div>
        </div>
      </div>
    </div>

    <div class="desktop:mt-0 mt-[-4.6154vw]">
      <CartProducts
        v-if="
          step == 'cart' &&
          Cart.products.reduce((sum, product) => sum + product.amount, 0) > 0
        "
        @next-step="(form) => goToOrder(form)"
      />
      <PlaceOrder
        v-if="step == 'order' && cart_cleared == 0"
        @send-order="sendOrder"
      />
      <FormedPage v-if="step == 'formed'" />
    </div>
    <!--Если корзина пуста, то орисовываем empty page-->
    <div
      v-if="
        step != 'formed' &&
        Cart.products.reduce((sum, product) => sum + product.amount, 0) == 0
      "
    >
      <!--Прокручиваем страницу вверх-->
      {{ scrollToTop() }}

      <!--Отрисовка empty page на десктопе-->
      <div
        v-if="isDesktop"
        class="flex font-TT font-bold px-[29px] py-[1.8750vw]"
      >
        <div
          class="w-1/2 whitespace-pre-wrap font-bold text-[#8B8B8B] text-[40px] h-[280px] flex items-center justify-center"
        >
          {{ t("cart.cart_empty").toUpperCase() }}
        </div>
        <div class="w-1/2 whitespace-pre-wrap text-[40px] leading-[2.5vw]">
          {{ t("cart.cart_empty_description").toUpperCase() }}
          <div
            @click="
              $emit('hideCart');
              router.push('/');
            "
            v-if="
              Cart.products.reduce((sum, product) => sum + product.amount, 0) ==
              0
            "
            class="font-TT font-bold mt-[50px] mb-[6vw] text-[1.1250vw] w-[240px] h-[35px] hover:bg-black hover:text-white flex justify-center items-center border border-black"
          >
            {{ t("cart.shop_now").toUpperCase() }}
          </div>
        </div>
      </div>

      <!--Отрисовка empty page на мобильной версии-->
      <div v-else class="px-[23px] mt-[6.1538vw]">
        <div
          class="whitespace-pre-wrap text-[10.2564vw] leading-[10.2564vw] font-TT font-bold"
        >
          {{ t("cart.cart_empty_mobile").toUpperCase() }}
        </div>
        <div
          class="whitespace-pre-wrap text-[4.6154vw] leading-[4.6154vw] font-TT font-bold mt-[7vw]"
        >
          {{ t("cart.cart_empty_description").toUpperCase() }}
        </div>
        <div
          @click="
            $emit('hideCart');
            router.push('/');
          "
          v-if="
            Cart.products.reduce((sum, product) => sum + product.amount, 0) == 0
          "
          class="font-TT text-[4.6154vw] mt-[12.8205vw] mb-[20.5128vw] font-bold h-[10.2564vw] w-[89.7436vw] m-auto hover:bg-black hover:text-white flex justify-center items-center border border-black"
        >
          {{ t("cart.shop_now").toUpperCase() }}
        </div>
      </div>
    </div>
    <!--Заканчиваем отрисовку empty page-->
  </div>
</template>

<style scoped></style>
