<script setup lang="ts">
import {components} from "../../types/schema";
import {AppStore} from "../../store/AppStore.ts";
import {CartStore} from "../../store/CartStore.ts";
import {useI18n} from "vue-i18n";
import {useWindowWidth} from "../../composables/isDesktop.ts";

const {t} = useI18n({useScope: 'global'})
const App = AppStore()
const Cart = CartStore()
defineProps<{
  product: {
    amount: number,
    product: components["schemas"]["Product"]
  }
}>()

const {isDesktop} = useWindowWidth()
</script>

<template>
  <div class="w-full flex border-black border-b desktop:pt-8 desktop:pb-8 py-6">
    <div class="flex desktop:flex-row flex-col desktop:gap-6 gap-3 w-full">

      <div class="flex desktop:w-1/2 gap-4 desktop:gap-0">

        <div v-if="isDesktop">
          <div class="flex">

            <div>
              <div class="flex">
                <div class="mr-6 w-[6.25vw] h-[8vw] self-start aspect-square">
                  <img :src="product.product.product_images[0].photo" class="h-full w-full object-cover"/>
                </div>

                  <div class="flex w-3/5 uppercase flex-col flex-nowrap">
                    <div class="title w-auto text-[40px] leading-[40px] ">
                      {{App.language == 'ru' ? product.product.rus_name : product.product.eng_name}}
                    </div>
                    <div class="relative font-TT text-[1.1250vw] leading-[1.4063vw] font-bold w-[60%] h-full">
                      <div >
                        {{App.language == 'ru' ? product.product.rus_title : product.product.eng_title}}
                      </div>
                    </div>
                  </div>

                </div>
                <div class="flex">
                  <div class="mr-6 w-[6.25vw]"></div>
                  <img :src="product.product.colour.photo" class="w-[1.8750vw] mt-4 aspect-square self-auto ml-0">
                </div>

              </div>
            </div>
        </div>

        <div v-else class="w-full">
          <div class="flex w-full gap-5">
            <div class="w-[17.9487vw] h-[20.5128vw]">
              <img :src="product.product.product_images[0].photo" class="w-full h-full object-cover"/>
            </div>
            <div class="font-TT font-bold w-[65%] uppercase text-[10.2564vw] leading-[10.2564vw]">
              {{App.language == 'ru' ? product.product.rus_name: product.product.eng_name}}
            </div>
          </div>
          <div class="flex w-full pt-[10px] gap-5">
            <div class="w-[17.9487vw]">
            </div>
            <div class="w-[50%] font-TT text-[4.6154vw] leading-[5.7692vw] font-bold">
              {{App.language == 'ru' ? product.product.rus_title.toUpperCase() : product.product.eng_title.toUpperCase()}}
            </div>
            <img :src="product.product.colour.photo" class="w-6 aspect-square self-start ml-auto">
          </div>
        </div>

      </div>

      <div class="flex desktop:w-1/3 gap-[4.1026vw] desktop:gap-0 mt-3 desktop:m-0">
        <div class="desktop:mr-6 w-[20%] desktop:w-auto font-TT font-semibold desktop:text-[1.1250vw] desktop:leading-[1.4063vw] text-[4.6154vw] leading-[5.7692vw]">{{ product.amount }}</div>
        <div @click="Cart.changeAmount(product.product.id, false)"
            class="desktop:mr-3 flex hover:bg-black hover:text-white text-3xl font-light w-10 h-10 border-black border items-center before:content-[''] before:w-1/2 before:bg-black before:h-[2px] hover:before:bg-white justify-center">
        </div>
        <div @click="Cart.changeAmount(product.product.id, true)"
            class="flex relative hover:bg-black hover:text-white text-3xl font-light w-10 h-10 border-black border items-center justify-center before:content-[''] before:w-1/2 before:absolute before:bg-black before:h-[2px] hover:before:bg-white after:content-[''] after:w-1/2 after:bg-black after:h-[2px] hover:after:bg-white after:rotate-90">
        </div>
        <div class="font-TT grow desktop:hidden pl-4 flex justify-between font-semibold">
          <div @click="Cart.deleteProduct(product.product.id)" class="desktop:mt-auto text-[3.5897vw] leading-[4.4872vw]">{{ t('cart.delete') }}</div>
          <div class="text-end ml-auto text-[4.6154vw] leading-[5.7692vw]">
            {{App.language == 'ru' ? product.product.rub_cost + '₽' : product.product.euro_cost + '€'}}
          </div>
        </div>
      </div>
      <div class="font-TT desktop:flex hidden flex-col ml-auto text-base font-semibold">
        <div class="text-end whitespace-nowrap">
          {{App.language == 'ru' ? product.product.rub_cost + '₽' : product.product.euro_cost + '€'}}
        </div>
        <div @click="Cart.deleteProduct(product.product.id)" class="mt-auto">{{ t('cart.delete') }}</div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
