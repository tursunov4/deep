<script setup lang="ts">
// import { ref, computed, onMounted } from "vue";

// import { useWindowWidth } from "../composables/isDesktop";
import { useI18n } from "vue-i18n";
import router from "../router";

// const { isDesktop } = useWindowWidth();

const { t, locale } = useI18n({ useScope: "global" });

const menuItems = [
  { title: "САНТЕХНИКА", link: "/santexnika" },
  { title: "ОСВЕЩЕНИЕ", link: "/osveshchenie" },
  { title: "ДВЕРИ", link: "/doori" },
  { title: "МЕБЕЛЬ", link: "/mebel" },
  { title: "ФУРНИТУРА", link: "/furnitura" },
  { title: "КОЛЛЕКЦИИ", link: "/collections" },
  { title: "ВДОХНОВЕНИЕ", link: "/vdohnovenie" },
  { title: "КАТАЛОГИ", link: "/catalogs" },
  { title: "О НАС", link: "/about" },
];
</script>

<template>
  <header
    class="w-full bg-custom-gradient text-white flex items-center justify-between px-6 desktop:px-[60px] desktop: pb-[130px] pt-[30px] h-[200px] fixed top-0 left-0 z-50 font-TT text-[14px] tracking-[0.03em]"
  >
    <!-- Logo -->

    <!-- Menu Items -->
    <div class="flex items-center gap-[26px]">
      <img
        src="/logo-black.svg"
        class="h-[30px] desktop:h-[35px] cursor-pointer"
        @click="router.push('/')"
      />
      <nav class="hidden desktop:flex gap-[20px]">
        <RouterLink
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
          class="hover:opacity-70 transition-all"
        >
          {{ item.title }}
        </RouterLink>
      </nav>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-5">
      <!-- Language Switch -->
      <div class="flex items-center gap-2 text-[12px]">
        <button
          @click="locale = 'en'"
          :class="{ 'opacity-60': locale !== 'en' }"
        >
          EN
        </button>
        <span>|</span>
        <button
          @click="locale = 'ru'"
          :class="{ 'opacity-60': locale !== 'ru' }"
        >
          RU
        </button>
      </div>

      <!-- Cart Icon -->
      <img
        src="../assets/basket-black.svg"
        alt="Cart"
        class="h-[22px] w-[22px] cursor-pointer"
        @click="$emit('showCart')"
      />
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  opacity: 1;
}
</style>
