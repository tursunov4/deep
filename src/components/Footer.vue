<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "../router";
import { onMounted, ref, Ref } from "vue";
import { components, paths } from "../types/schema";
import createClient from "openapi-fetch";
import { AppStore } from "../store/AppStore.ts";
import WhatsAppicon from "../assets/whatsapp.svg";
import Printericon from "../assets/pinterest.svg";
import Telegramicon from "../assets/telegram.svg";
import Facebookicon from "../assets/Facebook.svg";
import Instagramicon from "../assets/Instagramm.svg";
import Youtubeicon from "../assets/youtube.svg";
import { useModal } from "../composables/useModal";
const { openModal } = useModal();
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
  <div
    class="w-full hidden desktop:flex flex-wrap border-t border-black text-black"
  >
    <!-- Desktop -->
    <div class="w-full hidden pl-[30px] desktop:flex">
      <!-- Column 1: Company -->
      <div
        class="w-1/4 border-r border-black flex flex-col justify-between py-10 px-4"
      >
        <div>
          <div class="text-xs text-[#6D6D6D] mb-4">Depp Design</div>
          <ul
            class="font-bold font-TT text-[18px] flex uppercase flex-col gap-1"
          >
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
              <a @click="openModal" class="cursor-pointer">{{
                t("footer.architect_program")
              }}</a>
            </li>
            <li>
              <a class="cursor-pointer">{{ t("footer.become_dealer") }}</a>
            </li>
          </ul>
        </div>
        <div class="mt-6 flex items-end justify-between">
          <div class="text-xs text-[#6D6D6D]">© Depp Design 2025</div>
          <div class="text-xs text-[#6D6D6D]">{{ t("footer.rights") }}</div>
        </div>
      </div>

      <!-- Column 2: Products -->
      <div class="w-1/4 border-r border-black flex flex-col py-10 px-4">
        <div class="text-xs text-[#6D6D6D] mb-4">
          {{ t("footer.products_list") }}
        </div>
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
        <div class="text-xs text-[#6D6D6D] mb-4">
          {{ t("footer.promotions") }}
        </div>
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
          <div class="text-xs text-[#6D6D6D]">{{ t("footer.contacts") }}</div>
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

          <div class="text-[#6D6D6D] text-xs mt-2">
            {{ t("footer.work_time") }}
          </div>
          <div class="mt-2">
            <p class="font-bold uppercase font-TT text-[18px] mt-4">
              {{ t("footer.week") }}
            </p>
            <a
              class="font-bold uppercase font-TT text-[18px] mt-4 mb-2"
              href="mailto:info@depp-d.com"
            >
              {{ t("footer.weekend") }}
            </a>
          </div>
          <div class="text-[#6D6D6D] text-xs mt-2">
            {{ t("header.menu.mail_phone") }}
          </div>
          <div class="mt-2">
            <a
              class="font-bold font-TT text-[18px] mt-4 mb-2"
              href="tel:+79099993517"
              >+7 (909) 999 35 17</a
            ><br />
            <a
              class="font-bold uppercase font-TT text-[18px] mt-4 mb-2"
              href="mailto:info@depp-d.com"
              >info@depp-d.com</a
            >
          </div>
          <div class="text-[#6D6D6D] text-xs mt-2">
            {{ t("footer.support") }}
          </div>
          <div class="mt-2">
            <a
              class="font-bold font-TT uppercase text-[18px] mt-4 mb-2"
              href="mailto:info@depp-d.com"
            >
              support@depp-d.com</a
            >
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <img class="w-[27.9px] h-[27.9px]" :src="WhatsAppicon" />
          <img class="w-[27.9px] h-[27.9px]" :src="Telegramicon" />
          <img class="w-[27.9px] h-[27.9px]" :src="Printericon" />
          <img class="w-[27.9px] h-[27.9px]" :src="Facebookicon" />
          <img class="w-[27.9px] h-[27.9px]" :src="Instagramicon" />
          <img class="w-[27.9px] h-[27.9px]" :src="Youtubeicon" />
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
        <p class="text-xs text-[#6D6D6D] uppercase">
          {{ t("footer.addressName") }}
        </p>
        <p class="text-[18px] font-TT font-bold mt-1">
          {{ t("footer.address") }}
        </p>
        <a
          href="https://yandex.ru/maps/-/CDqKrQYL"
          target="_blank"
          class="text-xs underline mt-1 inline-block"
        >
          {{ t("footer.map") }}
        </a>
      </div>

      <!-- Work time -->
      <div>
        <p class="text-xs text-[#6D6D6D] uppercase">
          {{ t("footer.work_time") }}
        </p>
        <p class="text-[18px] font-TT font-bold mt-1 uppercase">
          {{ t("header.week") }}
        </p>
        <p class="text-[18px] font-TT font-bold uppercase">
          {{ t("header.weekend") }}
        </p>
      </div>

      <!-- Phone & Email -->
      <div>
        <p class="text-xs text-[#6D6D6D] uppercase">
          {{ t("footer.mail_phone") }}
        </p>
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
        <p class="text-xs text-[#6D6D6D] uppercase">
          {{ t("footer.support") }}
        </p>
        <a
          href="mailto:support@depp-d.com"
          class="block text-[18px] font-TT font-bold uppercase mt-1"
          >support@depp-d.com</a
        >
      </div>

      <!-- Links - Depp Design -->
      <div>
        <p class="text-xs text-[#6D6D6D] uppercase">Depp Design</p>
        <div class="flex flex-col gap-1 mt-2 text-[18px] font-TT font-bold">
          <a @click="router.push('/about')" class="cursor-pointer">{{
            t("header.menu.about")
          }}</a>
          <a class="cursor-pointer">{{ t("footer.inspiration") }}</a>
          <a class="cursor-pointer">{{ t("footer.services") }}</a>
          <a @click="openModal" class="cursor-pointer">
            {{ t("footer.architect_program") }}
          </a>
          <a class="cursor-pointer">{{ t("footer.become_dealer") }}</a>
        </div>
      </div>

      <!-- Links - Promotions -->
      <div>
        <p class="text-xs text-[#6D6D6D] uppercase">
          {{ t("footer.promotions") }}
        </p>
        <div class="flex flex-col gap-1 mt-2 text-[18px] font-TT font-bold">
          <a class="cursor-pointer">{{ t("footer.sale") }}</a>
          <a class="cursor-pointer">{{ t("footer.special_offers") }}</a>
          <a class="cursor-pointer">{{ t("footer.discount") }}</a>
        </div>
      </div>

      <!-- Socials -->
      <div class="flex items-center gap-4 mt-2">
        <img class="w-[27.9px] h-[27.9px]" :src="WhatsAppicon" />
        <img class="w-[27.9px] h-[27.9px]" :src="Telegramicon" />
        <img class="w-[27.9px] h-[27.9px]" :src="Printericon" />
        <img class="w-[27.9px] h-[27.9px]" :src="Facebookicon" />
        <img class="w-[27.9px] h-[27.9px]" :src="Instagramicon" />
        <img class="w-[27.9px] h-[27.9px]" :src="Youtubeicon" />
      </div>

      <!-- Bottom note -->
      <div class="text-xs text-[#6D6D6D] text-center mt-4 leading-tight">
        All rights reserved<br />
        © Depp Design 2024
      </div>
    </div>
  </div>
  <!-- Mobile Footer -->
  <div class="w-full desktop:hidden border-t border-black text-black pt-5">
    <!-- Contact Info Section -->
    <div class="mb-5 px-5">
      <p class="text-[12px] font-arial font-normal text-[#6D6D6D] mb-[9px]">
        Контактные данные
      </p>
      <p class="text-[18px] font-TT font-normal uppercase leading-tight mb-1">
        МОСКВА, УЛ. СВОБОДЫ 35 СТР. 17
      </p>
      <p class="text-[18px] font-TT font-normal uppercase">КАРТА</p>
    </div>

    <!-- Work Hours -->
    <div class="mb-5 px-5">
      <p class="text-[12px] font-arial font-normal text-[#6D6D6D] mb-[9px]">
        Часы работы
      </p>
      <p
        class="text-[18px] text-[#6D6D6D] font-TT font-normal uppercase leading-tight mb-1"
      >
        ПОНЕДЕЛЬНИК–ПЯТНИЦА — 9:00–19:00
      </p>
      <p
        class="text-[18px] text-[#6D6D6D] font-TT font-normal uppercase leading-tight mb-1"
      >
        СУББОТА И ВОСКРЕСЕНЬЕ — ВЫХОДНОЙ
      </p>
    </div>

    <!-- Phone and Email -->
    <div class="mb-5 px-5">
      <p class="text-[12px] font-arial font-normal text-[#6D6D6D] mb-[9px]">
        Телефон и почта
      </p>
      <a
        href="tel:+79099993517"
        class="text-[18px] block font-TT font-normal uppercase leading-tight mb-1"
        >+7 909 999 3517</a
      >
      <a
        href="mailto:info@depp-d.com"
        class="text-[18px] font-TT font-normal uppercase leading-tight mb-1"
        >INFO@DEPP-D.COM</a
      >
    </div>

    <!-- Tech Support -->
    <div class="mb-5 px-5">
      <p class="text-[12px] font-arial font-normal text-[#6D6D6D] mb-[9px]">
        Техподдержка
      </p>
      <a
        href="mailto:support@depp-d.com"
        class="text-[18px] block font-TT font-normal uppercase leading-tight mb-1"
        >SUPPORT@DEPP-D.COM</a
      >
    </div>

    <!-- Two Column Section -->
    <div class="grid grid-cols-2 border-t px-5 border-black">
      <!-- Left Column -->
      <div class="col-span-1 p-5 pl-0 pt-5">
        <p class="text-[12px] font-arial font-normal text-[#6D6D6D] mb-[9px]">
          Depp Design
        </p>
        <ul class="font-bold font-TT text-[16px] uppercase space-y-1">
          <li>
            <a
              @click="router.push('/about')"
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >О КОМПАНИИ</a
            >
          </li>
          <li>
            <a
              @click="router.push('/inspirations')"
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >ВДОХНОВЕНИЕ</a
            >
          </li>
          <li>
            <a
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >УСЛУГИ</a
            >
          </li>
          <li>
            <a
              @click="openModal"
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >ДЛЯ АРХИТЕКТОРОВ</a
            >
          </li>
          <li>
            <a
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >СТАТЬ ДИЛЕРОМ</a
            >
          </li>
        </ul>
        <!-- Social Icons -->
        <div class="flex flex-wrap items-center mt-5 gap-[8.57px]">
          <img
            class="w-[22.9px] h-[22.9px]"
            :src="WhatsAppicon"
            alt="WhatsApp"
          />

          <img
            class="w-[22.9px] h-[22.9px]"
            :src="Telegramicon"
            alt="Telegram"
          />

          <img class="w-[22.9px] h-[22.9px]" :src="Printericon" alt="Print" />

          <img
            class="w-[22.9px] h-[22.9px]"
            :src="Facebookicon"
            alt="Facebook"
          />

          <img
            class="w-[22.9px] h-[22.9px]"
            :src="Instagramicon"
            alt="Instagram"
          />

          <img class="w-[22.9px] h-[22.9px]" :src="Youtubeicon" alt="YouTube" />
        </div>
      </div>

      <!-- Right Column -->
      <div class="col-span-1 p-5 border-l border-black">
        <p class="text-[12px] font-arial font-normal text-[#6D6D6D] mb-[9px]">
          Акции
        </p>
        <ul class="font-bold font-TT text-[16px] uppercase space-y-1">
          <li>
            <a
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >РАСПРОДАЖА</a
            >
          </li>
          <li>
            <a
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >СПЕЦИАЛЬНЫЕ</a
            >
          </li>
          <li>
            <a
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >ПРЕДЛОЖЕНИЯ</a
            >
          </li>
          <li>
            <a
              class="text-[18px] block font-TT font-normal uppercase leading-tight"
              >СКИДКИ</a
            >
          </li>
        </ul>
        <!-- Bottom note -->
        <div
          class="text-[12px] font-arial font-normal text-[#6D6D6D] mt-[60px] text-right leading-tight"
        >
          All right reserved<br />
          © Depp Design 2024
        </div>
      </div>
    </div>
  </div>
</template>
