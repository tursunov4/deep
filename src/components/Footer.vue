<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "../router";
import { onMounted, ref, Ref } from "vue";
import { components, paths } from "../types/schema";
import createClient from "openapi-fetch";
import { AppStore } from "../store/AppStore.ts";
import WhatsAppicon from "../assets/WhatsApp.svg";
const { t } = useI18n({ useScope: "global" });
const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });
const App = AppStore();
const categories: Ref<components["schemas"]["Categories"][]> = ref([]);

async function fetchCategories() {
  const { data, error } = await GET("/api/categories/", {});
  if (error) return;
  categories.value = data;
}

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="w-full flex flex-wrap border-t border-black text-black">
    <!-- Desktop -->
    <div class="w-full hidden pl-[30px] desktop:flex">
      <!-- Column 1: Company -->
      <div
        class="w-1/4 border-r border-black flex flex-col justify-between py-10 px-4"
      >
        <div>
          <div class="text-xs mb-4">Depp Design</div>
          <ul class="font-bold font-TT text-[18px] flex flex-col gap-1">
            <li>
              <a @click="router.push('/about')" class="cursor-pointer">{{
                t("header.menu.about")
              }}</a>
            </li>
            <li>
              <a class="cursor-pointer">{{ t("footer.inspiration") }}</a>
            </li>
            <li>
              <a class="cursor-pointer">{{ t("footer.services") }}</a>
            </li>
            <li>
              <a class="cursor-pointer">{{ t("footer.architect_program") }}</a>
            </li>
            <li>
              <a class="cursor-pointer">{{ t("footer.become_dealer") }}</a>
            </li>
          </ul>
        </div>
        <div class="mt-6 flex items-end justify-between">
          <div class="text-xs">© Depp Design 2024</div>
          <div class="text-xs">{{ t("footer.rights") }}</div>
        </div>
      </div>

      <!-- Column 2: Products -->
      <div class="w-1/4 border-r border-black flex flex-col py-10 px-4">
        <div class="text-xs mb-4">{{ t("footer.products_list") }}</div>
        <ul class="font-bold font-TT text-[18px] flex flex-col gap-1">
          <li
            v-for="category in categories"
            :key="category.id"
            class="cursor-pointer"
            @click="router.push('/category/' + category.eng_name)"
          >
            {{
              App.language === "ru"
                ? category.rus_name.toUpperCase()
                : category.eng_name.toUpperCase()
            }}
          </li>
        </ul>
      </div>

      <!-- Column 3: Promotions -->
      <div class="w-1/4 border-r border-black flex flex-col py-10 px-4">
        <div class="text-xs mb-4">{{ t("footer.promotions") }}</div>
        <ul class="font-bold font-TT text-[18px] flex flex-col gap-1">
          <li>
            <a class="cursor-pointer">{{ t("footer.sale") }}</a>
          </li>
          <li>
            <a class="cursor-pointer">{{ t("footer.special_offers") }}</a>
          </li>
          <li>
            <a class="cursor-pointer">{{ t("footer.discount") }}</a>
          </li>
        </ul>
      </div>

      <!-- Column 4: Contacts -->
      <div class="w-1/4 flex flex-col py-10 px-4 justify-between">
        <div>
          <div class="text-xs">{{ t("footer.contacts") }}</div>
          <div
            class="font-bold font-TT text-[18px] whitespace-pre-wrap mt-4 mb-2"
          >
            {{ t("footer.head") }}
          </div>
          <!-- <div class="whitespace-pre">
            <a href="https://yandex.ru/maps/-/CDqKrQYL" target="_blank">{{
              t("header.menu.address")
            }}</a>
          </div> -->

          <div class="whitespace-pre text-xs mt-2">Часы работы</div>
          <div class="mt-2">
            <p
              class="font-bold uppercase font-TT text-[18px] whitespace-pre-wrap mt-4"
            >
              Понедельник–пятница — 9:00–19:00
            </p>
            <a
              class="font-bold uppercase font-TT text-[18px] whitespace-pre-wrap mt-4 mb-2"
              href="mailto:info@depp-d.com"
            >
              Суббота и воскресенье — выходной</a
            >
          </div>
          <div class="whitespace-pre text-xs mt-2">
            {{ t("header.menu.mail_phone") }}
          </div>
          <div class="mt-2">
            <a
              class="font-bold font-TT text-[18px] whitespace-pre-wrap mt-4 mb-2"
              href="tel:+79099993517"
              >+7 (909) 999 35 17</a
            ><br />
            <a
              class="font-bold uppercase font-TT text-[18px] whitespace-pre-wrap mt-4 mb-2"
              href="mailto:info@depp-d.com"
              >info@depp-d.com</a
            >
          </div>
          <div class="whitespace-pre text-xs mt-2">Техподдержка</div>
          <div class="mt-2">
            <a
              class="font-bold font-TT uppercase text-[18px] whitespace-pre-wrap mt-4 mb-2"
              href="mailto:info@depp-d.com"
            >
              support@depp-d.com</a
            >
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <img class="w-[27.9px] h-[27.9px]" :src="WhatsAppicon" />
          <img class="w-[27.9px] h-[27.9px]" src="../assets/Telegaramm.svg" />
          <img class="w-[27.9px] h-[27.9px]" src="../assets/Pinterest.svg" />
          <img class="w-[27.9px] h-[27.9px]" src="../assets/Facebook.svg" />
          <img class="w-[27.9px] h-[27.9px]" src="../assets/Instagramm.svg" />
          <img class="w-[27.9px] h-[27.9px]" src="../assets/youtube.svg" />
        </div>
      </div>
    </div>
    <!-- Mobile Footer -->
    <!-- Mobile Footer -->
    <div
      class="w-full flex flex-col border-t border-black text-black px-4 py-6 gap-6 desktop:hidden"
    >
      <!-- Address -->
      <div>
        <p class="text-xs uppercase">Контактные данные</p>
        <p class="text-[18px] font-TT font-bold mt-1">
          Москва, ул. Свободы 35 стр. 17
        </p>
        <a
          href="https://yandex.ru/maps/-/CDqKrQYL"
          target="_blank"
          class="text-xs underline mt-1 inline-block"
          >КАРТА</a
        >
      </div>

      <!-- Work time -->
      <div>
        <p class="text-xs uppercase">Часы работы</p>
        <p class="text-[18px] font-TT font-bold mt-1 uppercase">
          Понедельник–Пятница — 9:00–19:00
        </p>
        <p class="text-[18px] font-TT font-bold uppercase">
          Суббота и Воскресенье — выходной
        </p>
      </div>

      <!-- Phone & Email -->
      <div>
        <p class="text-xs uppercase">Телефон и почта</p>
        <a
          href="tel:+79099993517"
          class="block text-[18px] font-TT font-bold mt-1"
          >+7 909 999 3517</a
        >
        <a
          href="mailto:info@depp-d.com"
          class="block text-[18px] font-TT font-bold uppercase"
          >info@depp-d.com</a
        >
      </div>

      <!-- Support -->
      <div>
        <p class="text-xs uppercase">Техподдержка</p>
        <a
          href="mailto:support@depp-d.com"
          class="block text-[18px] font-TT font-bold uppercase mt-1"
          >support@depp-d.com</a
        >
      </div>

      <!-- Links - Depp Design -->
      <div>
        <p class="text-xs uppercase">Depp Design</p>
        <div class="flex flex-col gap-1 mt-2 text-[18px] font-TT font-bold">
          <a @click="router.push('/about')" class="cursor-pointer">{{
            t("header.menu.about")
          }}</a>
          <a class="cursor-pointer">{{ t("footer.inspiration") }}</a>
          <a class="cursor-pointer">{{ t("footer.services") }}</a>
          <a class="cursor-pointer">{{ t("footer.architect_program") }}</a>
          <a class="cursor-pointer">{{ t("footer.become_dealer") }}</a>
        </div>
      </div>

      <!-- Links - Promotions -->
      <div>
        <p class="text-xs uppercase">{{ t("footer.promotions") }}</p>
        <div class="flex flex-col gap-1 mt-2 text-[18px] font-TT font-bold">
          <a class="cursor-pointer">{{ t("footer.sale") }}</a>
          <a class="cursor-pointer">{{ t("footer.special_offers") }}</a>
          <a class="cursor-pointer">{{ t("footer.discount") }}</a>
        </div>
      </div>

      <!-- Socials -->
      <div class="flex items-center gap-4 mt-2">
        <img :src="WhatsAppicon" class="w-5 h-5" />
        <img src="../assets/Telegram.svg" class="w-5 h-5" />
        <img src="../assets/phone.svg" class="w-5 h-5" />
        <img src="../assets/pinterest.svg" class="w-5 h-5" />
        <img src="../assets/Instagramm.svg" class="w-5 h-5" />
        <img src="../assets/youtube.svg" class="w-5 h-5" />
      </div>

      <!-- Bottom note -->
      <div class="text-xs text-center mt-4 leading-tight">
        All rights reserved<br />
        © Depp Design 2024
      </div>
    </div>
  </div>
</template>
