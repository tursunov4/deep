<script setup lang="ts">
import router from "../../router";
import createClient from "openapi-fetch";
import { onMounted, ref, watch } from "vue";
import { AppStore } from "../../store/AppStore";
import { useI18n } from "vue-i18n";
import { useHead } from "@vueuse/head";

// ✨ Oddiy type’lar
type MainSeo = {
  meta_title_ru: string;
  meta_title_eng: string;
  meta_description_ru: string;
  meta_description_eng: string;
  meta_keywords_ru: string;
  meta_keywords_eng: string;
  og_title_ru: string;
  og_title_eng: string;
  og_description_ru: string;
  og_description_eng: string;
  og_image: string | null;
  canonical_url: string;
  robots_content: string;
};

type Subcategory = {
  id: number;
  eng_name: string;
  rus_name: string;
  banner: string;
};

const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient({ baseUrl: HOST });

const App = AppStore();
const { locale, t } = useI18n({ useScope: "global" });

const mainSubs = ref<Subcategory[]>([]);
const seoData = ref<MainSeo | null>(null);

function applySeoHead(data: MainSeo, lang: string) {
  const title = lang === "ru" ? data.meta_title_ru : data.meta_title_eng;
  const description =
    lang === "ru" ? data.meta_description_ru : data.meta_description_eng;
  const keywords =
    lang === "ru" ? data.meta_keywords_ru : data.meta_keywords_eng;
  const ogTitle = lang === "ru" ? data.og_title_ru : data.og_title_eng;
  const ogDescription =
    lang === "ru" ? data.og_description_ru : data.og_description_eng;
  const canonical = data.canonical_url;
  const robotsContent = data.robots_content;

  useHead({
    title,
    meta: [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:image", content: data.og_image || "" },
      { name: "robots", content: robotsContent },
    ],
    link: [{ rel: "canonical", href: canonical }],
  });
}

async function fetchMain() {
  const { data, error } = await GET("/api/main/", {});
  if (error) return;
  mainSubs.value = data;
}

async function fetchSeo() {
  const { data, error } = await GET("/api/main_seo/", {});
  if (error || !data) return;
  seoData.value = data;
  applySeoHead(data, locale.value);
}

onMounted(() => {
  fetchMain();
  fetchSeo();
});

watch(locale, (newLocale) => {
  if (seoData.value) {
    applySeoHead(seoData.value, newLocale);
  }
});
</script>

<template>
  <div class="w-full flex flex-wrap desktop:flex-row min-h-screen relative">
    <div
      class="desktop:w-1/2 w-full desktop:aspect-auto desktop:h-auto aspect-[14/13] bg-bottom bg-cover bg-no-repeat bg-[url('./assets/mainPage/doors.png')]"
    >
      <RouterLink
        to="/doors"
        class="w-full h-full main-p gap-4 text-white flex flex-col justify-end"
      >
        <div class="title text-[40px] leading-[40px] desktop:leading-[60px]">
          {{ t("main.doors") }}
        </div>
        <div class="text-[16px]">{{ t("main.left_desc") }}</div>
      </RouterLink>
    </div>
    <div class="desktop:w-1/2 w-full flex flex-col">
      <div
        v-if="mainSubs[0]"
        @click="router.push('/sub-category/' + mainSubs[0].eng_name)"
        class="cursor-pointer w-full relative main-p gap-4 text-white flex flex-col justify-end desktop:h-screen desktop:aspect-auto aspect-[40/24]"
      >
        <img
          :src="mainSubs[0].banner"
          class="absolute -z-10 top-0 left-0 w-full h-full object-cover desktop:object-center object-[0px_-130px] brightness-75 desktop:brightness-100"
        />
        <div class="title text-[40px] leading-[40px] desktop:leading-[60px]">
          {{
            App.language == "ru"
              ? mainSubs[0].rus_name.toUpperCase()
              : mainSubs[0].eng_name.toUpperCase()
          }}
        </div>
        <div class="text-[16px]">{{ t("main.right_top_desc") }}</div>
      </div>
      <div
        v-if="mainSubs[1]"
        @click="router.push('/sub-category/' + mainSubs[1].eng_name)"
        class="cursor-pointer desktop:w-full relative main-p gap-4 text-white flex flex-col justify-end desktop:aspect-[4/3] aspect-[40/24]"
      >
        <img
          :src="mainSubs[1].banner"
          class="absolute -z-10 top-0 left-0 w-full h-full object-cover brightness-75 desktop:brightness-100"
        />
        <div class="title text-[40px] leading-[40px] desktop:leading-[60px]">
          {{
            App.language == "ru"
              ? mainSubs[1].rus_name.toUpperCase()
              : mainSubs[1].eng_name.toUpperCase()
          }}
        </div>
        <div class="text-[16px]">{{ t("main.right_bottom_desc") }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.darker {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../../assets/mainPage/bathroom.png");
}
</style>
