// @ts-nocheck
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import localeEn from "./locales/en.json";
import localeRu from "./locales/ru.json";

import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import { createHead } from "@vueuse/head"; // ✅ qo‘shildi

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const head = createHead(); // ✅ head yaratildi

const app = createApp(App);

app
  .use(VueAwesomePaginate)
  .use(pinia)
  .use(router)
  .use(
    createI18n<[TLocaleSchema], "ru" | "en">({
      locale: "ru",
      legacy: false,
      globalInjection: true,
      messages: {
        ru: localeRu,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        en: localeEn,
      },
    })
  )
  .use(head) // ✅ head ni ulash
  .mount("#app");
