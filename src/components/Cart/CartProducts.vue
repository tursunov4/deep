<script setup lang="ts">
import ProductCard from "./CartProductCard.vue";
// @ts-ignore
import html2pdf from "html2pdf.js"
import {CartStore} from "../../store/CartStore.ts";
import {AppStore} from "../../store/AppStore.ts";
import {useI18n} from "vue-i18n";
import createClient from "openapi-fetch";
import {paths} from "../../types/schema";
import {onMounted, ref, watch} from "vue";
import router from "../../router";
const HOST = import.meta.env.VITE_HOST_NAME
const {GET} = createClient<paths>({baseUrl: HOST});

const {t} = useI18n({useScope: 'global'})

const Cart = CartStore()
const App = AppStore()

const emits = defineEmits(['nextStep', 'hideCart'])

const tax = ref(0)

watch(router.currentRoute, () => {
  emits('hideCart')
})

function exportToPDF() {
  html2pdf(document.getElementById("product-list"), {
    margin: [0, 6, 0, 6],
    filename: "DEPP.pdf",
  });
}

async function fetchTax(){
  const {data, error} = await GET('/api/main_tax/',{})
  if (error) return
  tax.value = data.tax
}

function getPdf() {
  const filename = 'order.pdf';
  html2pdf()
      .set({
        filename
      })
      .from(document.getElementById("product-list"))
      .toPdf()
      .output('datauristring')
      .then(function (pdfBase64: any) {
        console.log(pdfBase64)
        const file = new File(
            [pdfBase64],
            filename,
            {type: 'application/pdf'}
        )
        file.slice(1)
        emits('nextStep', pdfBase64)
      });
}

function getTax() {
  if (App.language == 'ru') {
    return '₽' + Cart.products.reduce((sum, product) => {
      if (product.product?.rub_cost && tax.value) {
        return sum + ((product.amount * product.product.rub_cost) * 0.01 * tax.value)
      } else return sum
    }, 0)
  } else return '€' + Cart.products.reduce((sum, product) => tax.value ? sum + ((product.amount * product.product.euro_cost) * 0.01 * tax.value) : sum, 0)
}

function getProducts(number: number) {
  let titles = ["товар", "товара", "товаров"]
  let cases = [2, 0, 1, 1, 1, 2];
  if (App.language == 'ru') {
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  } else return number == 1 ? 'product' : 'products'
}

function getPositions(number: number) {
  let cases = [2, 0, 1, 1, 1, 2];
  let titles = ["позиция", "позиции", "позиций"]
  if (App.language == 'ru') {
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
  } else return number == 1 ? 'position' : 'positions'

}

onMounted(() => {
  fetchTax()
})
</script>

<template>
  <div class="w-full flex px-6">
    <div class="desktop:w-1/2 pt-6 title hidden uppercase desktop:block desktop:text-[5vw] text-5xl">
      <div>
        {{ Cart.products.length + ' ' + getProducts(Cart.products.length) }} <br>{{ App.language == 'ru' ? '' : 'TOTAL' }}
      </div>
    </div>
    <div class="desktop:w-1/2 w-full">
      <div id="product-list">
        <div>
          <ProductCard v-for="product in Cart.products" :product="product"/>
        </div>
        <div class="border-black title text-base border-b my-4 desktop:py-6">
          <div class="w-full flex desktop:mb-4 mb-2 font-arial font-medium text-[3.0769vw] leading-[3.5385vw] desktop:text-[0.75vw] desktop:leading-[0.8625vw]">
            <div class="desktop:w-1/3 w-[35%]">
              {{ t('cart.name') }}
            </div>
            <div class="w-1/3">
              {{ t('cart.description') }}
            </div>
            <div class="ml-auto">
              {{ t('cart.total') }}
            </div>
          </div>
          <div class="w-full flex desktop:mb-[0.25vw] mb-0 desktop:text-[1.1250vw] desktop:leading-[1.4063vw] leading-[4.4872vw] text-[3.5897vw]">
            <div class="desktop:w-1/3 w-[35%]">
              {{ t('cart.product_total') }}
            </div>
            <div class="w-[50%] uppercase">
              {{ Cart.products.length + ' ' + getPositions(Cart.products.length) }},
              {{
                Cart.products.reduce((sum, product) => sum + product.amount, 0) + ' ' + getProducts(Cart.products.reduce((sum, product) => sum + product.amount, 0))
              }}
            </div>
            <div class="ml-auto">
              {{
                App.language == 'ru' ? '₽' + Cart.products.reduce((sum, product) => product.product?.rub_cost ? sum + (product.amount * product.product.rub_cost) : sum, 0) : '€' + Cart.products.reduce((sum, product) => sum + (product.amount * product.product.euro_cost), 0)
              }}
            </div>
          </div>
          <div class="w-full flex desktop:mb-[0.25vw] mb-0 desktop:text-[1.1250vw] desktop:leading-[1.4063vw] leading-[4.4872vw] text-[3.5897vw]">
            <div class="desktop:w-1/3 w-[35%]">
              {{ t('cart.delivery') }}
            </div>
            <div class="w-1/3">
              {{ t('cart.free') }}
            </div>
            <div class="ml-auto">
              0
            </div>
          </div>
          <div class="w-full flex desktop:mb-4 mb-2 desktop:text-[1.1250vw] desktop:leading-[1.4063vw] leading-[4.4872vw] text-[3.5897vw]">
            <div class="desktop:w-1/3 w-[35%]">
              {{ t('cart.tax') }}
            </div>
            <div class="w-1/3">
              {{ t('cart.included') }} <br> {{ tax + '%' }}
            </div>
            <div class="ml-auto">
              {{
                getTax()
              }}
            </div>
          </div>
        </div>
        <div class="desktop:py-6 font-bold desktop:text-[2.5vw] desktop:leading-[2.5vw] text-[10.2564vw] leading-[10.2564vw] font-TT">
          {{
            App.language == 'ru' ? '₽' + Cart.products.reduce((sum, product) => product.product?.rub_cost ? sum + (product.amount * product.product.rub_cost) : sum, 0) : '€' + Cart.products.reduce((sum, product) => sum + (product.amount * product.product.euro_cost), 0)
          }} <br> {{ t('cart.total_price') }}

        </div>
      </div>
      <div class="py-12 gap-6 flex desktop:flex-row flex-col items-center title text-base">
        <div @click="getPdf"
             class="desktop:w-1/2 w-full h-12 hover:bg-black hover:text-white  flex justify-center items-center border border-black">
          {{ t('cart.place_order') }}
        </div>
        <div @click="exportToPDF" class="cursor-pointer w-full desktop:w-auto flex h-12 gap-4 mt-auto">
          <div
              class="h-full bg-[url('./assets/PDF.png')] p-2 border border-black bg-origin-content bg-no-repeat bg-contain bg-center aspect-square"></div>
          <div class="flex flex-col">
            <div class="title text-base w-[80%]">
              {{ t('cart.download_pdf') }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>
