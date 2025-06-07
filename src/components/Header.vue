<script setup lang="js">
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import router from "../router";

const { locale } = useI18n({ useScope: "global" });

const isMobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeSubDropdown = ref(null);
const dropdownTimeout = ref(null);
const mobileMenuLevel = ref(0); // 0 = main menu, 1 = submenu

const menuItems = [
  { title: "САНТЕХНИКА", link: "#" },
  { title: "ОСВЕЩЕНИЕ", link: "/category/OFFSETS" },
  { title: "ДВЕРИ", link: "/doors" },
  { title: "МЕБЕЛЬ", link: "/mebel" },
  { title: "ФУРНИТУРА", link: "/#" },
  { title: "КОЛЛЕКЦИИ", link: "/collections" },
  { title: "ВДОХНОВЕНИЕ", link: "/inspirations" },
  { title: "КАТАЛОГИ", link: "/catalogs" },
  { title: "О НАС", link: "/about" },
];

// Full width dropdown menu data structure
const dropdownMenus = {
  САНТЕХНИКА: {
    categories: [
      { name: "ДИММЕРЫ", link: "/category/OFFSETS" },
      { name: "РОЗЕТКИ", link: "/category/OFFSETS" },
      { name: "ВЫКЛЮЧАТЕЛИ", link: "/category/OFFSETS" },
      { name: "ТЁПЛЫЙ ПОЛ", link: "/category/OFFSETS" },
      { name: "ПОТОЛОЧНЫЕ СВЕТИЛЬНИКИ", link: "/category/OFFSETS" },
    ],
    deepDesign: [
      { name: "ГЛАВНАЯ", link: "/главная" },
      { name: "О КОМПАНИИ", link: "/о-компании" },
      { name: "КОНТАКТЫ", link: "/контакты" },
      { name: "КАТАЛОГИ", link: "/каталоги" },
    ],
    information: [
      { name: "ГЛАВНАЯ", link: "/" },
      { name: "О КОМПАНИИ", link: "/about" },

      { name: "КАТАЛОГИ", link: "/catalogs" },
    ],
  },
  ФУРНИТУРА: {
    categories: [
      { name: "ДИММЕРЫ", link: "/category/OFFSETS" },
      { name: "РОЗЕТКИ", link: "/category/OFFSETS" },
      { name: "ВЫКЛЮЧАТЕЛИ", link: "/category/OFFSETS" },
      { name: "ТЁПЛЫЙ ПОЛ", link: "/category/OFFSETS" },
      { name: "ПОТОЛОЧНЫЕ СВЕТИЛЬНИКИ", link: "/category/OFFSETS" },
    ],
    forHome: [
      { name: "ПРОХОДНЫЕ", link: "/проходные" },
      { name: "ЛЕСТНИЧНЫЕ", link: "/лестничные" },
      { name: "ПЛАСТИНЫ", link: "/пластины" },
      { name: "ТУМБЛЕРЫ", link: "/тумблеры" },
    ],
    information: [
      { name: "ГЛАВНАЯ", link: "/" },
      { name: "О КОМПАНИИ", link: "/about" },

      { name: "КАТАЛОГИ", link: "/catalogs" },
    ],
  },
};

// Clear any existing timeout
const clearDropdownTimeout = () => {
  if (dropdownTimeout.value) {
    clearTimeout(dropdownTimeout.value);
    dropdownTimeout.value = null;
  }
};

// Handle dropdown hover with improved logic
const handleMouseEnter = (menuTitle) => {
  clearDropdownTimeout();
  // Always set the activeDropdown - if no dropdown exists, it will be null
  if (dropdownMenus[menuTitle]) {
    activeDropdown.value = menuTitle;
    activeSubDropdown.value = null;
  } else {
    // If hovering over a menu item without dropdown, clear active dropdown
    activeDropdown.value = null;
    activeSubDropdown.value = null;
  }
};

const handleMouseLeave = () => {
  clearDropdownTimeout();
  dropdownTimeout.value = setTimeout(() => {
    activeDropdown.value = null;
    activeSubDropdown.value = null;
  }, 150);
};

const handleDropdownEnter = () => {
  clearDropdownTimeout();
};

const handleDropdownLeave = () => {
  clearDropdownTimeout();
  dropdownTimeout.value = setTimeout(() => {
    activeDropdown.value = null;
    activeSubDropdown.value = null;
  }, 150);
};

const handleSubMenuEnter = (subMenuKey) => {
  activeSubDropdown.value = subMenuKey;
};

// Mobile menu handlers
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
    mobileMenuLevel.value = 0;
  } else {
    document.body.style.overflow = "";
    activeDropdown.value = null;
    activeSubDropdown.value = null;
    mobileMenuLevel.value = 0;
  }
};

const handleMobileMenuClick = (menuTitle) => {
  if (dropdownMenus[menuTitle]) {
    activeDropdown.value = menuTitle;
    activeSubDropdown.value = null;
    mobileMenuLevel.value = 1;
  } else {
    router.push(
      menuItems.find((item) => item.title === menuTitle)?.link || "/"
    );
    toggleMobileMenu();
  }
};

const goBackToMainMenu = () => {
  mobileMenuLevel.value = 0;
  activeDropdown.value = null;
  activeSubDropdown.value = null;
};

const handleMobileSubMenuClick = (subMenuKey) => {
  if (activeSubDropdown.value === subMenuKey) {
    activeSubDropdown.value = null;
  } else {
    activeSubDropdown.value = subMenuKey;
  }
};

// Close mobile menu on escape
const handleEscape = (e) => {
  if (e.key === "Escape" && isMobileMenuOpen.value) {
    toggleMobileMenu();
  }
};

// Navigation helper
const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
  clearDropdownTimeout();
});
</script>

<template>
  <header
    class="w-full text-white flex items-center justify-between px-6 desktop:px-[30px] pt-[30px] fixed top-0 left-0 z-50 font-TT text-[14px] tracking-[0.03em] transition-all duration-300"
    :class="[
      activeDropdown ? 'bg-black' : 'bg-custom-gradient',
      isMobileMenuOpen ? 'pb-[10px]' : 'pb-[100px]',
    ]"
  >
    <!-- Left: Logo + Desktop Menu -->
    <div class="flex items-center gap-[20px] z-50 relative">
      <img
        src="/logo-black.svg"
        class="h-[30px] desktop:h-[35px] z-50 cursor-pointer hover:opacity-80 transition-opacity duration-300"
        @click="navigateTo('/')"
        alt="Logo"
      />

      <!-- Desktop menu -->
      <nav class="hidden desktop:flex gap-[23px] relative">
        <div
          v-for="item in menuItems"
          :key="item.title"
          class="relative"
          @mouseenter="handleMouseEnter(item.title)"
          @mouseleave="handleMouseLeave"
        >
          <RouterLink
            :to="item.link"
            class="hover:text-[#8D8D8D] text-[#FFFFFF] transition-all font-bold text-[18px] leading-[100%] tracking-[0.02em] text-right uppercase duration-300 cursor-pointer py-2 px-1 rounded"
          >
            {{ item.title }}
          </RouterLink>
        </div>
      </nav>
    </div>

    <!-- Right: Lang, Cart, Hamburger -->
    <div class="flex items-center gap-4 relative">
      <!-- Language Switch -->
      <div class="desktop:flex hidden items-center gap-2 text-[12px]">
        <button
          @click="locale = 'en'"
          :class="{ 'opacity-60': locale !== 'en' }"
          class="hover:opacity-80 font-arial transition-opacity duration-300 p-1"
        >
          EN
        </button>

        <button
          @click="locale = 'ru'"
          :class="{ 'opacity-60': locale !== 'ru' }"
          class="hover:opacity-80 font-arial transition-opacity duration-300 p-1"
        >
          RU
        </button>
      </div>

      <!-- Cart -->
      <img
        src="../assets/basket-black.svg"
        alt="Cart"
        class="h-[35px] w-[35px] cursor-pointer z-50 hover:opacity-80 transition-opacity duration-300"
        @click="$emit('showCart')"
      />

      <!-- Toggle Hamburger/Close -->
      <button class="desktop:hidden relative z-50" @click="toggleMobileMenu">
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
    <!-- Full Width Desktop Dropdown -->
    <transition name="fade">
      <div
        v-if="activeDropdown && dropdownMenus[activeDropdown]"
        class="fixed top-[70px] left-0 w-full bg-black text-white shadow-2xl z-40 hidden desktop:block"
        @mouseenter="handleDropdownEnter"
        @mouseleave="handleDropdownLeave"
      >
        <div class="w-full mx-auto px-[94px] py-[40px]">
          <div class="grid grid-cols-6 gap-12 border-b border-gray-600 pb-5">
            <!-- Column 1 -->
            <div class="col-span-1">
              <h3 class="text-gray-400 text-[12px] font-normal mb-6">
                Компоненты
              </h3>
              <div class="space-y-4">
                <div
                  v-for="category in dropdownMenus[activeDropdown].categories"
                  :key="category.link"
                  class="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300 text-[18px]"
                  @click="navigateTo(`${category.link}`)"
                >
                  {{ category.name }}
                </div>
              </div>
            </div>

            <!-- Column 2 -->
            <div class="col-span-1">
              <h3 class="text-gray-400 text-[12px] font-normal mb-6">
                Сопутствующие товары
              </h3>
              <div class="space-y-4">
                <div
                  v-for="item in activeDropdown === 'САНТЕХНИКА'
                    ? dropdownMenus[activeDropdown].deepDesign
                    : dropdownMenus[activeDropdown].forHome"
                  :key="item.link"
                  class="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300 text-[18px]"
                  @click="navigateTo(`${item.link}`)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>

            <!-- Column 3 -->
            <div class="col-span-1">
              <h3 class="text-gray-400 text-[12px] font-normal mb-6">
                Информация
              </h3>
              <div class="space-y-4">
                <div
                  v-for="info in dropdownMenus[activeDropdown].information"
                  :key="info.link"
                  class="text-white hover:text-gray-300 cursor-pointer transition-colors duration-300 text-[18px]"
                  @click="navigateTo(`${info.link}`)"
                >
                  {{ info.name }}
                </div>
              </div>
            </div>

            <!-- Column 4 -->
            <div class="col-span-3 border-l border-gray-600 pl-[94.5px]">
              <img
                class="mb-3"
                src="../assets/deppdesign.svg"
                alt="deep design"
              />
              <p class="text-gray-400 text-xs leading-relaxed font-light">
                Разрабатывая и производя продукцию Depp-design мы стремимся
                создать детали, которые дополнят ваше пространство, создавая
                тонкую лаконичную атмосферу как для знаковых событий, так и для
                повседневной рутины. Ведь наша жизнь состоит из множества
                маленьких событий, которые складываются в единое целое.
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-black text-white overflow-y-auto pb-5"
      >
        <!-- Mobile Menu Content -->
        <div class="px-6 py-6 pt-[95px] h-full">
          <!-- Main Menu Level -->
          <div v-if="mobileMenuLevel === 0" class="h-full flex flex-col">
            <!-- Categories Header -->
            <div class="flex-1">
              <h3
                class="text-gray-400 pt-8 border-t border-[#9F9F9F] text-[12px] mb-5 tracking-wider font-medium"
              >
                Категории
              </h3>

              <div class="space-y-0">
                <div v-for="item in menuItems" :key="item.title" class="block">
                  <div
                    class="flex items-center gap-5 py-1 justify-between cursor-pointer text-[15px] text-white hover:opacity-70 transition-all duration-300"
                    @click="handleMobileMenuClick(item.title)"
                  >
                    <span>{{ item.title }}</span>
                    <svg
                      v-if="dropdownMenus[item.title]"
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Section -->
            <div class="mt-auto pt-5 border-gray-800 space-y-4">
              <!-- Deep Design Section -->
              <div class="mb-6">
                <h4
                  class="text-gray-400 pt-8 border-t border-[#9F9F9F] text-[12px] mb-5 tracking-wider font-medium"
                >
                  Deep Design
                </h4>
                <div class="space-y-0">
                  <div
                    class="text-white text-[15px] hover:opacity-70 cursor-pointer transition-opacity py-1"
                  >
                    ГЛАВНАЯ
                  </div>
                  <div
                    class="text-white text-[15px] hover:opacity-70 cursor-pointer transition-opacity py-1"
                  >
                    О КОМПАНИИ
                  </div>

                  <div
                    class="text-white text-[15px] hover:opacity-70 cursor-pointer transition-opacity py-1"
                  >
                    КАТАЛОГИ
                  </div>
                </div>
              </div>

              <!-- Language Switch -->
              <div class="flex items-center gap-4 pt-4 items-start">
                <button
                  @click="locale = 'ru'"
                  :class="[
                    'text-sm transition-colors font-arial duration-300',
                    locale === 'ru' ? 'text-white' : 'text-gray-400',
                  ]"
                >
                  RU
                </button>
                <button
                  @click="locale = 'en'"
                  :class="[
                    'text-sm transition-colors font-arial duration-300',
                    locale === 'en' ? 'text-white' : 'text-gray-400',
                  ]"
                >
                  EN
                </button>
              </div>

              <div class="grid grid-cols-2 pb-5">
                <!-- Contact Info -->
                <div class="text-gray-400 text-sm">
                  <div class="mb-2">+7 909 999 3517</div>
                  <div class="space-y-1">
                    <div>Москва, ул. Свободы 35</div>
                    <div>стр. 17</div>
                    <div>будни с 9:00—19:00</div>
                  </div>
                </div>
                <!-- Social Icons -->
                <div class="flex gap-4 pt-4 flex-wrap">
                  <a href="https://www.instagram.com/depp_d/" target="_blank">
                    <img
                      class="w-[35px]"
                      src="../assets/inst.svg"
                      alt="Instagram"
                  /></a>
                  <a
                    href="https://www.facebook.com/deppdesign/"
                    target="_blank"
                  >
                    <img
                      class="w-[35px]"
                      src="../assets/faceb.svg"
                      alt="Facebook"
                  /></a>
                  <a href="https://www.youtube.com/@deppdesign" target="_blank">
                    <img
                      class="w-[35px]"
                      src="../assets/youtube.svg"
                      alt="Youtube"
                  /></a>
                  <a href="https://t.me/deppdesign" target="_blank">
                    <img
                      class="w-[35px]"
                      src="../assets/tgwhite.svg"
                      alt="Telegram"
                  /></a>
                  <a href="https://wa.me/79099993517" target="_blank">
                    <img
                      class="w-[35px]"
                      src="../assets/WhatsAppwhite.svg"
                      alt="WhatsApp"
                  /></a>
                  <a
                    href="https://www.pinterest.com/deppdesign/"
                    target="_blank"
                  >
                    <img
                      class="w-[35px]"
                      src="../assets/printestw.svg"
                      alt="Pinterest"
                  /></a>
                </div>
              </div>
            </div>
          </div>

          <!-- Submenu Level -->
          <div
            v-if="mobileMenuLevel === 1 && activeDropdown"
            class="h-full flex flex-col"
          >
            <!-- Back Button -->
            <div class="flex justify-end items-center mb-6">
              <button
                @click="goBackToMainMenu"
                class="flex items-center text-white hover:opacity-70 transition-opacity"
              >
                <img src="../assets/back.svg" alt="" />
              </button>
            </div>

            <!-- Submenu Content -->
            <div class="flex-1">
              <!-- Categories Header -->
              <h3
                class="text-gray-400 font-normal font-arial mb-5 text-[12px] leading-[1] tracking-[0] align-middle"
              >
                Категории
              </h3>

              <!-- Categories List -->
              <div class="space-y-0 mb-8 pb-4 border-b border-gray-600">
                <div
                  v-for="category in dropdownMenus[activeDropdown].categories"
                  :key="category.name"
                  class="text-white font-normal text-[20px] leading-[15px] pb-5 tracking-[0] uppercase"
                  @click="
                    navigateTo(category.link);
                    toggleMobileMenu();
                  "
                >
                  {{ category.name }}
                </div>
              </div>

              <!-- For Home / Deep Design Section -->
              <div class="mb-8">
                <div class="flex items-center justify-between cursor-pointer">
                  <span
                    class="text-gray-400 font-normal font-arial mb-5 text-[12px] leading-[1] tracking-[0] align-middle"
                    >Для дома
                  </span>
                </div>

                <div class="space-y-0">
                  <div
                    v-for="subItem in activeDropdown === 'САНТЕХНИКА'
                      ? dropdownMenus[activeDropdown].deepDesign
                      : dropdownMenus[activeDropdown].forHome"
                    :key="subItem.name"
                    class="text-white font-normal text-[20px] leading-[15px] pb-5 tracking-[0] uppercase"
                    @click="
                      navigateTo(subItem.link);
                      toggleMobileMenu();
                    "
                  >
                    {{ subItem.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>

  <!-- Mobile Menu Overlay -->
</template>

<style scoped>
.router-link-active {
  opacity: 1;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Custom gradient class agar Tailwind'da yo'q bo'lsa */
</style>
