<script setup lang="ts">
import NewProducts from "./HomePage/NewProducts.vue";
import AboutVideo from "./HomePage/AboutVideo.vue";
import router from "../router";
import { AppStore } from "../store/AppStore.ts";
import createClient from "openapi-fetch";
import { components, paths } from "../types/schema";
import { onMounted, ref, Ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

const App = AppStore();
const HOST = import.meta.env.VITE_HOST_NAME;
const { POST } = createClient<paths>({ baseUrl: HOST });

const category: Ref<components["schemas"]["List_subcategories"] | undefined> =
  ref();

async function fetchCategory() {
  const { data } = await POST("/api/categories/list-subcategories/", {
    body: {
      eng_name: router.currentRoute.value.params.id as string,
      rus_name: "string",
    },
  });
  if (data) {
    category.value = data;
  }
}

onMounted(() => {
  fetchCategory();
});

watch(
  () => router.currentRoute.value,
  () => {
    fetchCategory();
  }
);
</script>

<template>
  <div
    class="flex flex-col items-center desktop:mt-[155px] mt-[120px] desktop:mb-[45px] mb-[50px]"
  >
    <div v-if="category" class="flex flex-col items-center mx-auto my-auto">
      <h1
        class="title text-center desktop:text-[40px] uppercase desktop:leading-[40px] text-[40px] leading-[40px]"
      >
        {{
          App.language == "ru"
            ? category.category.rus_name
            : category.category.eng_name
        }}
      </h1>
      <div
        class="desktop:text-[18px] uppercase desktop:min-h-[27px] hidden desktop:block text-[10px] font-TT font-bold text-center"
      >
        {{ t("browse_category.browse_category") }}
      </div>
    </div>
  </div>
  <div>
    <!--breadcrumbs-->
    <ul
      class="flex px-4 gap-5 justify-start desktop:justify-end mt-0 text-[12px] desktop:ml-[13px] ml-[4px]"
    >
      <li @click="router.push('/')" class="cursor-pointer">
        {{ t("breadcrumbs.home") }}
      </li>
      <li v-if="category">
        {{
          App.language == "ru"
            ? category.category.rus_name.toUpperCase()
            : category.category.eng_name.toUpperCase()
        }}
      </li>
    </ul>

    <div
      v-if="category"
      :class="[category.subcategories.length < 2 ? 'border-t-0' : 'border-t']"
      class="cursor-pointer grid border-t desktop:grid-cols-2 grid-cols-1 desktop:border-l border-black mt-[16px] desktop:ml-[29px] desktop:mr-[29px] ml-[20px] mr-[20px]"
    >
      <div
        @click="
          router.push('/sub-category/' + subcategory.eng_name.toUpperCase())
        "
        v-for="subcategory in category.subcategories"
        :class="[category.subcategories.length < 2 ? 'border-t' : 'border-t-0']"
        class="border-black desktop:border-r border-b w-full aspect-[71/34] desktop:p-[29px] pt-[20px]"
      >
        <img
          :src="subcategory.banner"
          class="object-cover w-full aspect-[71/34]"
        />
        <div
          class="flex justify-between desktop:mt-[21px] desktop:mb-[-4px] mt-[7px] mb-[15px]"
        >
          <div class="title text-[18px]">
            {{
              App.language == "ru"
                ? subcategory.rus_name.toUpperCase()
                : subcategory.eng_name.toUpperCase()
            }}
          </div>
          <div class="text-[12px] mt-[4px]">
            {{ subcategory.product_counter }}
          </div>
        </div>
      </div>
    </div>
    <!--end list of subcategories-->

    <NewProducts class="desktop:mt-[79px] mt-[58px]" />
    <AboutVideo class="desktop:aspect-auto aspect-[4/5]" />
  </div>
</template>

<style scoped></style>
