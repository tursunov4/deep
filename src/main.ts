// @ts-nocheck
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import '@mdi/font/css/materialdesignicons.css'
import {createPinia} from "pinia";
import piniaPluginPersistedState, {createPersistedState} from "pinia-plugin-persistedstate"

import { createI18n } from 'vue-i18n/dist/vue-i18n.esm-bundler.js'
import localeEn from './locales/en.json'
import localeRu from './locales/ru.json'

import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";


const pinia = createPinia();
pinia.use(piniaPluginPersistedState)

createApp(App).use(VueAwesomePaginate).use(pinia).use(router).use(
    createI18n<[TLocaleSchema], 'ru' | 'en'>({
        locale: 'ru',
        legacy: false,
        globalInjection: true,
        messages: {
            ru: localeRu,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            en: localeEn
        }
    })
).mount('#app')
