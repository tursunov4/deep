<script setup lang="ts">
import {onMounted, onUnmounted, watch} from "vue";
import router from "../router";
import {AppStore} from "../store/AppStore.ts";

defineEmits(['show', 'hide', 'showCart'])
const App = AppStore()
import {useI18n} from "vue-i18n";
import {components} from "../types/schema";
import {useWindowWidth} from "../composables/isDesktop.ts";

const {t} = useI18n({useScope: 'global'})
const {locale: i18nLocale} = useI18n({useScope: 'global'})
let scrollTop: number;

defineProps<{
  categories?: components["schemas"]["Categories"][]
}>()

type Language = 'ru' | 'en'

function changeLang(lang: Language) {
  i18nLocale.value = lang;
}

onMounted(() => {
  let body = document.querySelector('body') as HTMLBodyElement | null
  let html = document.querySelector('html') as HTMLBodyElement | null
  if (body && html) {
    scrollTop = (html.scrollTop) ? html.scrollTop : body.scrollTop;
    const b = document.body;
    b.style.setProperty('--st', -(document.documentElement.scrollTop) + "px");
    b.classList.add('noscroll');
  }

})
onUnmounted(() => {
  let body = document.querySelector('body') as HTMLBodyElement | null
  let html = document.querySelector('html') as HTMLBodyElement | null
  if (body && html) {
    const b = document.body;
    b.classList.remove('noscroll');
    html.scrollTo(0, scrollTop);
  }
})

watch(
    () => i18nLocale.value,
    (newLocale) => {
      App.language = newLocale as unknown as 'ru' | 'en'
    }
)
const {isDesktop} = useWindowWidth()

</script>

<template>
  <div @click.exact="$emit('hide')" class="fixed top-0 left-0 w-full bg-gray-800/50 z-[99] flex justify-end">
    <div @click.stop
         class="desktop:bg-white bg-black-general desktop:overflow-y-hidden overflow-y-scroll flex flex-col desktop:h-screen h-[100dvh] relative desktop:w-1/2  w-full">
      <div class="desktop:text-black text-white flex flex-col grow desktop:flex-row">
        <div
            class="desktop:w-1/2 desktop:grow flex flex-col relative w-full desktop:pt-[11.3125vw] pb-4 pt-28 main-p-sides border-b border-white desktop:border-r desktop:border-b-0 desktop:border-black">
          <div class="mb-5 desktop:text-[0.75vw]">{{ t('header.menu.categories') }}</div>
          <ul class="flex flex-col font-TT font-bold leading-10 desktop:leading-[2.5vw] text-[2.5rem] desktop:text-[2.1875vw] grow">
            <li @click="router.push('/category/' + category.eng_name); $emit('hide')" class="cursor-pointer"
                v-for="category in categories">
              {{ App.language == 'ru' ? category.rus_name.toUpperCase() : category.eng_name.toUpperCase() }}
            </li>
            <li @click="router.push('/doors/'); $emit('hide')"  class="cursor-pointer">{{ t('header.menu.doors') }}</li>
          </ul>
          <div class="mt-auto hidden desktop:block">
            <a class="title text-[1.1250vw] desktop:block hidden mt-10">
              {{ t('header.menu.search_market').toUpperCase() }}
            </a>
            <div class="whitespace-pre mt-[13px] desktop:text-[0.75vw] desktop:leading-[1vw]">
              <a href="https://yandex.ru/maps/-/CDqKrQYL" target="_blank">
                {{ t('header.menu.address') }}
              </a>
            </div>
            <div class="desktop:text-[0.75vw] desktop:leading-[1vw]">
              <a href="tel:+79099993517">+7 (909) 999 35 17</a>
              <br>
              <a href="mailto:info@depp-d.com">info@depp-d.com</a>
            </div>
            <div class="my-4 whitespace-pre desktop:text-[0.75vw] desktop:leading-[1vw]">{{ t('header.menu.working_hours') }}
            </div>
          </div>
        </div>
        <div
            class="desktop:w-1/2 h-full desktop:h-auto w-full desktop:relative flex flex-col desktop:justify-start justify-between pb-[17px] desktop:pt-[11.3125vw] pt-12 main-p-sides">
          <div
              class="w-full desktop:items-start items-center main-p pr-0 desktop:p-0 flex justify-end absolute top-0 right-0 text-black text-base">
            <div class="flex w-1/2 justify-between desktop:hidden items-center">
              <img @click="router.push('/');$emit('hide')" :src="isDesktop ? '/logo.svg' : '/logo-black.svg'"
                   class="cursor-pointer -ml-[1px] w-[40px] h-[40px]">
            </div>
            <div class="flex justify-end desktop:w-auto w-1/2 gap-4 desktop:main-p pr-[20px] desktop:pb-0 ">
              <button @click="$emit('showCart')"
                      class="desktop:h-[80px] desktop:w-[80px] desktop:min-h-[80px] desktop:min-w-[80px] min-h-[40px] desktop:text-[14px] text-[10px] tracking-[0.4px] min-w-[60px] h-[40px] w-[40px] ml-auto max-w-[100px] font-bold desktop:aspect-square aspect-video desktop:text-white font-TT bg-white desktop:bg-black-general">
                <span class="relative top-[1px]">
                  {{ t('header.cart_button') }}
                </span>
              </button>
              <button @click="$emit('hide')"
                      class="desktop:h-[80px]  desktop:w-[80px] desktop:min-h-[80px] desktop:min-w-[80px] min-h-[40px] desktop:text-[14px] text-[10px] text-center tracking-[0.4px] min-w-[60px] h-[40px] w-[40px] max-w-[100px] font-bold desktop:aspect-square aspect-video desktop:text-white font-TT bg-white desktop:bg-black-general">
                <span class="relative top-[1px]">
                  {{ t('header.close_button') }}
                </span>
              </button>
            </div>
          </div>
          <div class="mb-5 desktop:text-[0.75vw]">{{ t('header.menu.design') }}</div>
          <ul class="flex flex-col font-TT font-bold leading-10 text-[2.5rem] desktop:leading-[2.5vw] desktop:text-[2.1875vw]">
            <li @click="router.push('/');$emit('hide')" class="cursor-pointer">{{ t('header.menu.home') }}</li>
            <li @click="router.push('/about');$emit('hide')" class="cursor-pointer">{{ t('header.menu.about') }}</li>
            <li @click="router.push('/about' + '#contacts');$emit('hide')" class="cursor-pointer">
              {{ t('header.menu.contacts') }}
            </li>
            <li><RouterLink @click="$emit('hide')" to="/catalogs">{{ t('header.catalog') }}</RouterLink>
            </li>
            <li><RouterLink @click="$emit('hide')" to="/inspirations">{{ t('header.inspiration') }}</RouterLink></li>
            <li><RouterLink @click="$emit('hide')" to="/collections">{{ t('header.menu.collections') }}</RouterLink></li>
          </ul>
          <div class="flex mt-auto my-4">
            <div class="flex w-1/2 items-end text-base desktop:text-[0.75vw] gap-2 desktop:mt-auto mt-6">
              <div @click="changeLang('ru')"
                   :class="App.language == 'ru' ? 'desktop:text-black text-white' : 'text-gray-500'"
                   class="underline underline-offset-4">RU
              </div>
              <div @click="changeLang('en')"
                   :class="App.language == 'en' ? 'desktop:text-black text-white' : 'text-gray-500'"
                   class="underline underline-offset-4">EN
              </div>
            </div>
            <div class="w-1/2">
              <div class="flex justify-end mt-auto gap-[7px]">
                <img class="w-[27px] h-[27px]" src="../assets/whatsapp.svg"/>
                <img class="w-[27px] h-[27px]" src="../assets/telegram.svg"/>
                <a href="tel:+79099993517">
                  <img class="w-[27px] h-[27px]" src="../assets/phone.svg"/>
                </a>
              </div>
              <div class="flex justify-end mt-[7px] gap-[7px]">
                <img class="w-[27px] h-[27px]" src="../assets/pinterest.svg"/>
                <img class="w-[27px] h-[27px]" src="../assets/inst.svg"/>
                <img class="w-[27px] h-[27px]" src="../assets/youtube.svg"/>
                <img class="w-[27px] h-[27px]" src="../assets/telegram.svg"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full desktop:flex bg-black-general items-center desktop:h-[6.5vw] desktop:px-0 px-4">
        <div class="desktop:flex mt-auto hidden gap-[11px] p-[30px]">
          <img class="w-[1.6875vw] h-[1.6875vw]" src="../assets/whatsapp.svg"/>
          <img class="w-[1.6875vw] h-[1.6875vw]" src="../assets/telegram.svg"/>
          <a href="tel:+79099993517">
            <img class="w-[1.6875vw] h-[1.6875vw]" src="../assets/phone.svg"/>
          </a>
          <img class="w-[1.6875vw] h-[1.6875vw]" src="../assets/pinterest.svg"/>
          <img class="w-[1.6875vw] h-[1.6875vw]" src="../assets/inst.svg"/>
          <img class="w-[1.6875vw] h-[1.6875vw]" src="../assets/youtube.svg"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.noscroll {
  position: fixed;
  top: var(--st, 0);
  inline-size: 100%;
  overflow-y: scroll;
}

</style>
