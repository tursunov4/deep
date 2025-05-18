<script setup lang="ts">
import router from "../router";
import {components} from "../types/schema";
import {computed, ref, Ref} from "vue";
import {AppStore} from "../store/AppStore.ts";
import {useI18n} from "vue-i18n";
const { t } = useI18n({ useScope: 'global' })
const App = AppStore()

const props = defineProps<{
  productGroup: components["schemas"]["ProductInInspiration"]
}>()

const selected: Ref<number> = ref(props.productGroup.abstract_product_preview?.colored_products?.findIndex(product => product.id == props.productGroup?.colored_product?.id) ?? 0)

const selectedProduct: Ref<components["schemas"]["PreviewProduct"] | undefined> = computed(() => {
  if (!props.productGroup) return undefined
  return props.productGroup.abstract_product_preview?.colored_products?.[selected.value]
})
</script>

<template>
  <div v-if="selectedProduct" @click="router.push({path:'/product/' + productGroup.abstract_product_preview.id, query: {color: selectedProduct.id}})" class="cursor-pointer group relative w-full h-full flex flex-col">
    <div class="grow relative flex justify-center items-center overflow-hidden">
      <div class="absolute hidden group-hover:opacity-100 duration-300 desktop:flex justify-end opacity-0 top-0 left-0 w-full h-full z-10 gap-1 bg-black/50 p-6">
        <h3 class="font-TT z-0 absolute left-0 right-0 top-0 bottom-0 m-auto text-xl flex justify-center items-center text-white">{{t('product_page.discover')}}</h3>
        <img v-for="(product, index) in productGroup.abstract_product_preview.colored_products" @click.stop="selected = index" :src="product.colour.photo" :class="{'border border-white': index == selected}" class="w-[26px] z-10 p-[3px] self-end aspect-square"/>
      </div>
      <img v-for="(product) in productGroup.abstract_product_preview.colored_products" :src="product.main_photo.photo" :class="[product.id == selectedProduct.id ? 'opacity-100' : 'opacity-0']" class="h-full z-0 absolute top-0 left-0 w-full object-cover"/>
    </div>
    <div class="w-full flex pt-[13px] gap-4 justify-between relative">
      <div class="text-ellipsis grow overflow-hidden whitespace-nowrap block ">
        {{ App.language == 'ru' ? productGroup.abstract_product_preview.rus_name.toUpperCase() : productGroup.abstract_product_preview.eng_name.toUpperCase() }}
      </div>
      <div class="flex justify-end">
        {{App.language == 'ru' ? selectedProduct.rub_cost : selectedProduct.euro_cost}}
        <img v-if="App.language == 'ru'" src="../assets/ruble-bold.svg" class="desktop:w-[10.5px] w-[10px] mt-[-0.5px]"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
