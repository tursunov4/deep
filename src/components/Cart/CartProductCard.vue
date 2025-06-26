<script setup lang="ts">
import { components } from "../../types/schema";
import { AppStore } from "../../store/AppStore.ts";
import { CartStore } from "../../store/CartStore.ts";
import { useI18n } from "vue-i18n";
// import { useWindowWidth } from "../../composables/isDesktop.ts";

const { t } = useI18n({ useScope: "global" });
const App = AppStore();
const Cart = CartStore();
defineProps<{
  product: {
    amount: number;
    product: components["schemas"]["Product"];
  };
}>();
</script>

<template>
  <div
    class="w-full flex border-black border-b desktop:py-8 py-5 last:border-b-0"
  >
    <div class="flex desktop:flex-row flex-col desktop:gap-6 gap-3 w-full">
      <div class="desktop:w-full gap-4 desktop:gap-0">
        <div class="w-full">
          <div class="flex relative w-full items-start gap-5 justify-between">
            <div>
              <div class="flex items-start dekstop:items-center gap-5">
                <div
                  class="w-[103px] h-[119px] desktop:w-[120px] desktop:h-[138px] self-start aspect-square"
                >
                  <img
                    :src="product.product.product_images[0].photo"
                    class="h-full w-full object-cover"
                  />
                </div>

                <div
                  class="title font-normal w-auto text-[18px] font-TT leading-[18px] desktop:text-[40px] desktop:leading-[40px]"
                >
                  {{
                    App.language == "ru"
                      ? product.product.rus_name
                      : product.product.eng_name
                  }}
                </div>
              </div>
            </div>
            <div>
              <div class="dekstop:flex hidden items-center">
                <div
                  class="desktop:mr-6 w-[20%] desktop:w-auto font-TT font-semibold desktop:text-[1.1250vw] desktop:leading-[1.4063vw] text-[4.6154vw] leading-[5.7692vw]"
                >
                  {{ product.amount }}
                </div>
                <div
                  @click="Cart.changeAmount(product.product.id, false)"
                  class="desktop:mr-3 flex hover:bg-black hover:text-white text-3xl cursor-pointer font-light w-[35px] h-[35px] border-black border items-center before:content-[''] before:w-1/2 before:bg-black before:h-[2px] hover:before:bg-white justify-center"
                ></div>
                <div
                  @click="Cart.changeAmount(product.product.id, true)"
                  class="flex relative hover:bg-black hover:text-white text-3xl cursor-pointer font-light w-[35px] h-[35px] border-black border items-center justify-center before:content-[''] before:w-1/2 before:absolute before:bg-black before:h-[2px] hover:before:bg-white after:content-[''] after:w-1/2 after:bg-black after:h-[2px] hover:after:bg-white after:rotate-90"
                ></div>
                <div
                  class="font-TT grow desktop:hidden pl-4 flex justify-between font-semibold"
                >
                  <div
                    @click="Cart.deleteProduct(product.product.id)"
                    class="desktop:mt-auto text-[3.5897vw] leading-[4.4872vw]"
                  >
                    {{ t("cart.delete") }}
                  </div>
                  <div
                    class="text-end ml-auto text-[4.6154vw] leading-[5.7692vw]"
                  >
                    {{
                      App.language == "ru"
                        ? product.product.rub_cost + "₽"
                        : product.product.euro_cost + "€"
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div
              @click="Cart.deleteProduct(product.product.id)"
              class="font-TT cursor-pointer font-normal text-[18px] uppercase text-[#6D6D6D]"
            >
              <span class="desktop:block hidden"> {{ t("cart.delete") }}</span>
              <img
                class="desktop:hidden"
                src="/remove.svg"
                width="15"
                height="15"
              />
            </div>
            <div class="absolute w-auto right-0 bottom-0 flex items-center">
              <div
                class="desktop:mr-6 w-[20%] desktop:w-auto font-TT font-semibold desktop:text-[1.1250vw] desktop:leading-[1.4063vw] text-[4.6154vw] leading-[5.7692vw]"
              >
                {{ product.amount }}
              </div>
              <div
                @click="Cart.changeAmount(product.product.id, false)"
                class="desktop:mr-3 mr-2 flex hover:bg-black hover:text-white text-3xl cursor-pointer font-light w-[35px] h-[35px] border-black border items-center before:content-[''] before:w-1/2 before:bg-black before:h-[2px] hover:before:bg-white justify-center"
              ></div>
              <div
                @click="Cart.changeAmount(product.product.id, true)"
                class="flex relative hover:bg-black hover:text-white text-3xl cursor-pointer font-light w-[35px] h-[35px] border-black border items-center justify-center before:content-[''] before:w-1/2 before:absolute before:bg-black before:h-[2px] hover:before:bg-white after:content-[''] after:w-1/2 after:bg-black after:h-[2px] hover:after:bg-white after:rotate-90 g"
              ></div>
              <div
                class="font-TT grow desktop:hidden pl-4 flex justify-between font-semibold"
              >
                <div
                  class="text-end ml-auto text-[4.6154vw] leading-[5.7692vw]"
                >
                  {{
                    App.language == "ru"
                      ? product.product.rub_cost + "₽"
                      : product.product.euro_cost + "€"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center dekstop:flex-row flex-row-reverse justify-between gap-3 mt-[14px] desktop:ml-[140px]"
        >
          <div
            class="flex desktop:w-[220px] dekstop:flex-row flex-row-reverse items-center gap-5"
          >
            <img
              :src="product.product.colour.photo"
              class="w-[35px] h-[35px] aspect-square self-auto ml-0"
            />
            <div class="font-bold text-[18px]">
              {{ product.product.colour.rus_name }}
            </div>
          </div>
          <div class="dekstop:flex hidden items-center">
            <div
              class="desktop:mr-6 w-[20%] desktop:w-auto font-TT font-semibold desktop:text-[1.1250vw] desktop:leading-[1.4063vw] text-[4.6154vw] leading-[5.7692vw]"
            >
              {{ product.amount }}
            </div>
            <div
              @click="Cart.changeAmount(product.product.id, false)"
              class="desktop:mr-3 flex hover:bg-black hover:text-white text-3xl cursor-pointer font-light w-[35px] h-[35px] border-black border items-center before:content-[''] before:w-1/2 before:bg-black before:h-[2px] hover:before:bg-white justify-center"
            ></div>
            <div
              @click="Cart.changeAmount(product.product.id, true)"
              class="flex relative hover:bg-black hover:text-white text-3xl cursor-pointer font-light w-[35px] h-[35px] border-black border items-center justify-center before:content-[''] before:w-1/2 before:absolute before:bg-black before:h-[2px] hover:before:bg-white after:content-[''] after:w-1/2 after:bg-black after:h-[2px] hover:after:bg-white after:rotate-90"
            ></div>
            <div
              class="font-TT grow desktop:hidden pl-4 flex justify-between font-semibold"
            >
              <div
                @click="Cart.deleteProduct(product.product.id)"
                class="desktop:mt-auto text-[3.5897vw] leading-[4.4872vw]"
              >
                {{ t("cart.delete") }}
              </div>
              <div class="text-end ml-auto text-[4.6154vw] leading-[5.7692vw]">
                {{
                  App.language == "ru"
                    ? product.product.rub_cost + "₽"
                    : product.product.euro_cost + "€"
                }}
              </div>
            </div>
          </div>

          <div class="font-TT font-bold text-[18px]">
            <div class="text-end whitespace-nowrap">
              {{
                App.language == "ru"
                  ? product.product.rub_cost + "₽"
                  : product.product.euro_cost + "€"
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
