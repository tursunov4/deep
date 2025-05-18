<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "../router";
import { onMounted, ref, Ref } from "vue";
import { components, paths } from "../types/schema";
import createClient from "openapi-fetch";
import { AppStore } from "../store/AppStore.ts";
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
          <div class="text-sm mb-4">Depp Design</div>
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
        <div class="text-sm mb-4">{{ t("footer.products_list") }}</div>
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
        <div class="text-sm mb-4">{{ t("footer.promotions") }}</div>
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
          <div class="text-sm">{{ t("footer.contacts") }}</div>
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

          <div class="whitespace-pre mt-2">Часы работы</div>
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
          <div class="whitespace-pre mt-2">
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
          <div class="whitespace-pre mt-2">Техподдержка</div>
          <div class="mt-2">
            <a
              class="font-bold font-TT uppercase text-[18px] whitespace-pre-wrap mt-4 mb-2"
              href="mailto:info@depp-d.com"
            >
              support@depp-d.com</a
            >
          </div>
        </div>
        <div class="flex gap-3 bg-black-general mt-6">
          <img class="w-[20px] h-[20px]" src="../assets/whatsapp.svg" />
          <img class="w-[20px] h-[20px]" src="../assets/telegram.svg" />
          <img class="w-[20px] h-[20px]" src="../assets/phone.svg" />
          <img class="w-[20px] h-[20px]" src="../assets/pinterest.svg" />
          <img class="w-[20px] h-[20px]" src="../assets/inst.svg" />
          <img class="w-[20px] h-[20px]" src="../assets/youtube.svg" />
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div class="w-full desktop:hidden px-4 py-6 flex flex-wrap gap-y-6">
      <!-- Contacts -->
      <div class="w-full">
        <div class="text-sm">{{ t("footer.contacts") }}</div>
        <div class="font-bold font-TT text-[18px] my-3 whitespace-pre">
          {{ t("footer.head") }}
        </div>
        <div class="whitespace-pre">
          <a href="https://yandex.ru/maps/-/CDqKrQYL" target="_blank">{{
            t("header.menu.address")
          }}</a>
        </div>
        <div class="my-3 whitespace-pre">
          {{ t("header.menu.working_hours") }}
        </div>
        <div class="my-2 whitespace-pre">{{ t("header.menu.mail_phone") }}</div>
        <div class="mt-2">
          <a href="tel:+79099993517">+7 (909) 999 35 17</a><br />
          <a href="mailto:info@depp-d.com">info@depp-d.com</a>
        </div>
        <div
          class="font-bold font-TT text-[18px] my-4 cursor-pointer"
          @click="router.push('/about#map')"
        >
          {{ t("footer.map") }}
        </div>
      </div>

      <!-- Social Icons -->
      <div class="w-1/2 flex flex-col gap-2">
        <div class="flex gap-2">
          <img class="w-[24px] h-[24px]" src="../assets/whatsapp.svg" />
          <img class="w-[24px] h-[24px]" src="../assets/telegram.svg" />
          <img class="w-[24px] h-[24px]" src="../assets/phone.svg" />
        </div>
        <div class="flex gap-2">
          <img class="w-[24px] h-[24px]" src="../assets/pinterest.svg" />
          <img class="w-[24px] h-[24px]" src="../assets/inst.svg" />
          <img class="w-[24px] h-[24px]" src="../assets/youtube.svg" />
        </div>
      </div>

      <!-- Footer rights -->
      <div class="w-1/2 flex">
        <p class="text-xs">{{ t("footer.rights") }}</p>
        <div class="text-xs mt-1">© {{ t("footer.company_name") }} 2024</div>
      </div>
    </div>
  </div>
</template>
