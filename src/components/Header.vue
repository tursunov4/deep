<script setup lang="js">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "../router";

const { locale } = useI18n({ useScope: "global" });
const route = useRoute();

const isMobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeSubDropdown = ref(null);
const dropdownTimeout = ref(null);
const mobileMenuLevel = ref(0); // 0 = main menu, 1 = submenu

// Check if current page is main page
const isMainPage = computed(() => {
  return route.path === "/" || route.path === "/home";
});

// Dynamic styling based on page and dropdown state
const headerClasses = computed(() => {
  const baseClasses =
    "w-full flex items-center justify-between px-6 desktop:px-[30px] p-[30px] fixed top-0 left-0 z-50 font-TT text-[14px] tracking-[0.03em] transition-all duration-300";

  // If mobile menu is open, always use white text/icons on black background
  if (isMobileMenuOpen.value) {
    return `${baseClasses} text-white`;
  }

  // If dropdown is active, always use white text/icons
  if (activeDropdown.value) {
    return `${baseClasses} text-white`;
  }

  if (isMainPage.value) {
    // Main page: white text/icons
    return `${baseClasses} text-white`;
  } else {
    // Other pages: black text/icons
    return `${baseClasses} text-black`;
  }
});

const backgroundClasses = computed(() => {
  // If mobile menu is open, always black background
  if (isMobileMenuOpen.value) {
    return "bg-black";
  }

  if (activeDropdown.value) {
    return "bg-black";
  }

  if (isMainPage.value) {
    return "bg-custom-gradient"; // or bg-white if needed
  } else {
    return "bg-custom-gradientWhite";
  }
});

const logoSrc = computed(() => {
  // If mobile menu is open, use white logo (on black background)
  if (isMobileMenuOpen.value) {
    return "/logo-black.svg"; // Changed to white logo for better visibility
  }

  // If dropdown is active, always use white logo (on black background)
  if (activeDropdown.value) {
    return "/logo-black.svg"; // Changed to white logo for better visibility
  }
  // Otherwise use logic based on page
  return isMainPage.value ? "/logo-black.svg" : "/logo.svg";
});

// Cart icon logic
const cartIconSrc = computed(() => {
  // If mobile menu is open, use white icon (on black background)
  if (isMobileMenuOpen.value) {
    return "/cart-black.svg"; // Changed to white cart icon
  }

  // If dropdown is active, use white icon (on black background)
  if (activeDropdown.value) {
    return "/cart-black.svg"; // Changed to white cart icon
  }
  // Otherwise use logic based on page
  return isMainPage.value ? "/cart-black.svg" : "/cart-white.svg";
});

// Hamburger icon logic
const hamburgerIconSrc = computed(() => {
  if (isMobileMenuOpen.value) {
    // Close icon - always white on black background
    return "/close.svg"; // Make sure you have a white close icon
  } else {
    // Hamburger icon
    if (activeDropdown.value) {
      return "/hambur-white.svg"; // Changed to white hamburger icon
    }
    return isMainPage.value ? "/hambur-black.svg" : "/hambur-white.svg";
  }
});

// Text color classes for menu items and language buttons
const textColorClasses = computed(() => {
  // If mobile menu is open, always white
  if (isMobileMenuOpen.value) {
    return {
      menuHover: "text-[#8D8D8D] hover:text-white",
      langButton: "text-white",
    };
  }

  // If dropdown is active, always white
  if (activeDropdown.value) {
    return {
      menuHover: "text-[#8D8D8D] hover:text-white",
      langButton: "text-[#8D8D8D]",
    };
  }

  // Otherwise based on page
  if (isMainPage.value) {
    return {
      menuHover: "text-[#8D8D8D] hover:text-white",
      langButton: "text-[#8D8D8D]",
    };
  } else {
    return {
      menuHover: "text-black hover:text-[#666666]",
      langButton: "text-black",
    };
  }
});

const menuItems = [
  { title: "САНТЕХНИКА", link: "#" },
  { title: "ОСВЕЩЕНИЕ", link: "/category/Lighting" },
  { title: "ДВЕРИ", link: "/doors" },
  { title: "МЕБЕЛЬ", link: "/Category/Furniture" },
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
      { name: "Пластины и тумблеры", link: "/category/OFFSETS" },
      { name: "Монтажные коробки", link: "/category/OFFSETS" },
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
      { name: "Пластины и тумблеры", link: "/category/OFFSETS" },
      { name: "Монтажные коробки", link: "/category/OFFSETS" },
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
  if (dropdownMenus[menuTitle]) {
    activeDropdown.value = menuTitle;
    activeSubDropdown.value = null;
  } else {
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

function changeLang(lang) {
  locale.value = lang;
}

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

import { AppStore } from "../store/AppStore";
const App = AppStore();

watch(
  () => locale.value,
  (newVal) => {
    App.language = newVal;
  }
);
</script>

<template>
  <header
    :class="[
      headerClasses,
      backgroundClasses,
      isMobileMenuOpen ? 'pb-[10px]' : '',
    ]"
  >
    <!-- Left: Logo + Desktop Menu -->
    <div class="flex items-center gap-[20px] z-50 relative">
      <img
        :src="logoSrc"
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
            :class="[
              'transition-all font-bold text-[18px] leading-[100%] tracking-[0.02em] text-right uppercase duration-300 cursor-pointer py-2 px-1 rounded',
              textColorClasses.menuHover,
            ]"
          >
            {{ item.title }}
          </RouterLink>
        </div>
      </nav>
    </div>

    <!-- Right: Lang, Cart, Hamburger -->
    <div class="flex items-center gap-4 relative">
      <!-- Language Switch -->
      <div
        v-if="isMainPage || activeDropdown"
        class="desktop:flex hidden items-center gap-2 text-[12px]"
      >
        <button
          @click="changeLang('en')"
          :class="[
            'hover:text-white font-normal font-arial transition-opacity duration-300 p-1',
            locale !== 'en' ? 'text-[#9F9F9F]' : 'text-white',
          ]"
        >
          EN
        </button>

        <button
          @click="changeLang('ru')"
          :class="[
            'font-arial font-normal hover:text-white  transition-opacity duration-300 p-1',
            locale !== 'ru' ? 'text-[#9F9F9F]' : 'text-white',
          ]"
        >
          RU
        </button>
      </div>

      <!-- Cart -->
      <img
        :src="cartIconSrc"
        alt="Cart"
        class="h-[35px] w-[35px] cursor-pointer z-50 transition-opacity duration-300"
        @click="$emit('showCart')"
      />

      <!-- Toggle Hamburger/Close -->
      <button class="desktop:hidden relative z-50" @click="toggleMobileMenu">
        <img
          :src="hamburgerIconSrc"
          :alt="isMobileMenuOpen ? 'close menu' : 'open menu'"
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
          <div class="grid grid-cols-6 border-b border-gray-600 pb-5">
            <!-- Column 1 -->
            <div class="col-span-1">
              <h3 class="text-gray-400 text-[12px] font-normal mb-6">
                Компоненты
              </h3>
              <div class="space-y-4">
                <div
                  v-for="category in dropdownMenus[activeDropdown].categories"
                  :key="category.link"
                  class="text-white hover:text-[#8D8D8D] cursor-pointer transition-colors duration-300 text-[18px]"
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
                  class="text-white uppercase hover:text-[#8D8D8D] cursor-pointer transition-colors duration-300 text-[18px]"
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

    <!-- Mobile Menu -->
    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-black text-white overflow-y-auto pb-5"
        style="background-color: rgba(0, 0, 0, 0.95)"
      >
        <!-- Mobile Menu Content -->
        <div class="px-6 py-6 pt-[95px] h-full">
          <!-- Main Menu Level -->
          <div v-if="mobileMenuLevel === 0" class="h-full flex flex-col">
            <!-- Categories Header -->
            <div class="flex-1">
              <h3
                class="text-gray-300 pt-8 border-t border-gray-600 text-[12px] mb-5 tracking-wider font-medium"
              >
                Категории
              </h3>

              <div class="space-y-0">
                <div v-for="item in menuItems" :key="item.title" class="block">
                  <div
                    class="flex items-center gap-5 py-1 justify-between cursor-pointer text-[15px] text-white hover:text-gray-300 transition-all duration-300"
                    @click="handleMobileMenuClick(item.title)"
                  >
                    <span>{{ item.title }}</span>
                    <svg
                      v-if="dropdownMenus[item.title]"
                      class="w-5 h-5 text-white"
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
                  class="text-gray-300 pt-8 border-t border-gray-600 text-[12px] mb-5 tracking-wider font-medium"
                >
                  Deep Design
                </h4>
                <div class="space-y-0">
                  <div
                    class="text-white text-[15px] hover:text-gray-300 cursor-pointer transition-opacity py-1"
                    @click="
                      navigateTo('/');
                      toggleMobileMenu();
                    "
                  >
                    ГЛАВНАЯ
                  </div>
                  <div
                    class="text-white text-[15px] hover:text-gray-300 cursor-pointer transition-opacity py-1"
                    @click="
                      navigateTo('/about');
                      toggleMobileMenu();
                    "
                  >
                    О КОМПАНИИ
                  </div>
                  <div
                    class="text-white text-[15px] hover:text-gray-300 cursor-pointer transition-opacity py-1"
                    @click="
                      navigateTo('/catalogs');
                      toggleMobileMenu();
                    "
                  >
                    КАТАЛОГИ
                  </div>
                </div>
              </div>

              <!-- Language Switch -->
              <div class="flex items-center gap-4 pt-4 items-start">
                <button
                  @click="changeLang('ru')"
                  :class="[
                    'text-sm transition-colors font-arial duration-300',
                    locale === 'ru' ? 'text-white' : 'text-gray-400',
                  ]"
                >
                  RU
                </button>
                <button
                  @click="changeLang('en')"
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
                <div class="text-gray-300 text-sm">
                  <div class="mb-2 text-white">+7 909 999 3517</div>
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
                      class="w-[35px] filter brightness-100"
                      src="../assets/inst.svg"
                      alt="Instagram"
                  /></a>
                  <a
                    href="https://www.facebook.com/deppdesign/"
                    target="_blank"
                  >
                    <img
                      class="w-[35px] filter brightness-100"
                      src="../assets/faceb.svg"
                      alt="Facebook"
                  /></a>
                  <a href="https://www.youtube.com/@deppdesign" target="_blank">
                    <img
                      class="w-[35px] filter brightness-100"
                      src="../assets/youtube.svg"
                      alt="Youtube"
                  /></a>
                  <a href="https://t.me/deppdesign" target="_blank">
                    <img
                      class="w-[35px] filter brightness-100"
                      src="../assets/tgwhite.svg"
                      alt="Telegram"
                  /></a>
                  <a href="https://wa.me/79099993517" target="_blank">
                    <img
                      class="w-[35px] filter brightness-100"
                      src="../assets/WhatsAppwhite.svg"
                      alt="WhatsApp"
                  /></a>
                  <a
                    href="https://www.pinterest.com/deppdesign/"
                    target="_blank"
                  >
                    <img
                      class="w-[35px] filter brightness-100"
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
                class="flex items-center text-white hover:text-gray-300 transition-opacity"
              >
                <img
                  src="../assets/back.svg"
                  alt="Back"
                  class="filter brightness-100"
                />
              </button>
            </div>

            <!-- Submenu Content -->
            <div class="flex-1">
              <!-- Categories Header -->
              <h3
                class="text-gray-300 font-normal font-arial mb-5 text-[12px] leading-[1] tracking-[0] align-middle"
              >
                Категории
              </h3>

              <!-- Categories List -->
              <div class="space-y-0 mb-8 pb-4 border-b border-gray-600">
                <div
                  v-for="category in dropdownMenus[activeDropdown].categories"
                  :key="category.name"
                  class="text-white font-normal text-[20px] leading-[15px] pb-5 tracking-[0] uppercase cursor-pointer hover:text-gray-300 transition-opacity"
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
                    class="text-gray-300 font-normal font-arial mb-5 text-[12px] leading-[1] tracking-[0] align-middle"
                    >Для дома
                  </span>
                </div>

                <div class="space-y-0">
                  <div
                    v-for="subItem in activeDropdown === 'САНТЕХНИКА'
                      ? dropdownMenus[activeDropdown].deepDesign
                      : dropdownMenus[activeDropdown].forHome"
                    :key="subItem.name"
                    class="text-white font-normal text-[20px] leading-[15px] pb-5 tracking-[0] uppercase cursor-pointer hover:text-gray-300 transition-opacity"
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
.bg-custom-gradientWhite {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.62) 0%,
    rgba(243, 243, 243, 0.16) 82.5%,
    rgba(231, 231, 231, 0) 100%
  );
}

/* Additional mobile menu visibility fixes */
.mobile-menu-overlay {
  background-color: rgba(0, 0, 0, 0.95) !important;
}

/* Ensure all text is visible on mobile menu */
.mobile-menu-text {
  color: #ffffff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
