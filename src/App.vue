<script setup lang="ts">
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";

const App = AppStore()
import {useI18n} from "vue-i18n";
import {onMounted, ref} from "vue";
import {AppStore} from "./store/AppStore.ts";
import CartPage from "./components/Cart/CartPage.vue";

const {locale: i18nLocale} = useI18n({useScope: 'global'})
const showCart = ref(false)

onMounted(() => {
  i18nLocale.value = App.language
})

</script>

<template>
  <div class="overflow-x-hidden font-arial text-[12px] relative">
    <div id="collection-button" class="absolute"/>
    <Header :cartVisible="showCart" @show-cart="showCart=true" @hide-cart="showCart=false"/>
    <div v-if="showCart" class="w-full">
      <CartPage @hide-cart="showCart=false" :cartVisible="showCart"/>
    </div>
    <keep-alive v-else>
      <div class="min-h-screen w-full">
        <router-view/>
      </div>
    </keep-alive>
    <Footer/>
  </div>
</template>

<style>
body {
  display: inherit;
}

.section {
  overflow: hidden;
  transition: height 0.3s ease-out;
}

.hide-scrollbar {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}

</style>
