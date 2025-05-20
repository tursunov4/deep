<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import router from "../router";

const { locale } = useI18n({ useScope: "global" });

const isMobileMenuOpen = ref(false);

const menuItems = [
  { title: "САНТЕХНИКА", link: "/santexnika" },
  { title: "ОСВЕЩЕНИЕ", link: "/osveshchenie" },
  { title: "ДВЕРИ", link: "/doors" },
  { title: "МЕБЕЛЬ", link: "/mebel" },
  { title: "ФУРНИТУРА", link: "/furnitura" },
  { title: "КОЛЛЕКЦИИ", link: "/collections" },
  { title: "ВДОХНОВЕНИЕ", link: "/inspirations" },
  { title: "КАТАЛОГИ", link: "/catalogs" },
  { title: "О НАС", link: "/about" },
];
</script>

<template>
  <header
    class="w-full bg-custom-gradient text-white flex items-center justify-between px-6 desktop:px-[60px] pt-[20px] pb-[20px] h-[80px] fixed top-0 left-0 z-50 font-TT text-[14px] tracking-[0.03em]"
  >
    <!-- Left: Logo + Desktop Menu -->
    <div class="flex items-center gap-[20px]">
      <img
        src="/logo-black.svg"
        class="h-[30px] desktop:h-[35px] cursor-pointer"
        @click="router.push('/')"
      />

      <!-- Desktop menu -->
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

    <!-- Right: Lang, Cart, Hamburger -->
    <div class="flex items-center gap-4 relative">
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

      <!-- Cart -->
      <img
        src="../assets/basket-black.svg"
        alt="Cart"
        class="h-[35px] w-[35px] cursor-pointer"
        @click="$emit('showCart')"
      />

      <!-- Toggle Hamburger/Close -->
      <button
        class="desktop:hidden relative z-50"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <img
          v-if="isMobileMenuOpen"
          src="../assets/close.svg"
          alt="close menu"
          class="h-[25px] w-[25px] transition-transform duration-300"
        />
        <img
          v-else
          src="../assets/hambur.png"
          alt="open menu"
          class="h-[35px] w-[35px] transition-transform duration-300"
        />
      </button>
    </div>
  </header>

  <!-- Mobile Menu Overlay -->
  <transition name="fade">
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black text-white flex flex-col items-start px-6 pt-[100px] pb-10 gap-6 font-TT text-[16px]"
    >
      <RouterLink
        v-for="item in menuItems"
        :key="item.title"
        :to="item.link"
        class="hover:opacity-60 transition-all"
        @click="isMobileMenuOpen = false"
      >
        {{ item.title }}
      </RouterLink>
    </div>
  </transition>
</template>

<style scoped>
.router-link-active {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
