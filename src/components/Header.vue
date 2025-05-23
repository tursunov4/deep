<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import router from "../router";

const { locale } = useI18n({ useScope: "global" });

const isMobileMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeSubDropdown = ref(null);

const menuItems = [
  { title: "САНТЕХНИКА", link: "/santexnika" },
  { title: "ОСВЕЩЕНИЕ", link: "/lighting" },
  { title: "ДВЕРИ", link: "/doors" },
  { title: "МЕБЕЛЬ", link: "/mebel" },
  { title: "ФУРНИТУРА", link: "/furnitura" },
  { title: "КОЛЛЕКЦИИ", link: "/collections" },
  { title: "ВДОХНОВЕНИЕ", link: "/inspirations" },
  { title: "КАТАЛОГИ", link: "/catalogs" },
  { title: "О НАС", link: "/about" },
];

// Full width dropdown menu data structure
const dropdownMenus = {
  САНТЕХНИКА: {
    categories: [
      "ДИММЕРЫ",
      "РОЗЕТКИ",
      "ВЫКЛЮЧАТЕЛИ",
      "ТЁПЛЫЙ ПОЛ",
      "ПОТОЛОЧНЫЕ СВЕТИЛЬНИКИ",
    ],
    deepDesign: ["ГЛАВНАЯ", "О КОМПАНИИ", "КОНТАКТЫ", "КАТАЛОГИ"],
    information: ["ГЛАВНАЯ", "О КОМПАНИИ", "КОНТАКТЫ", "КАТАЛОГИ"],
  },
  ФУРНИТУРА: {
    categories: [
      "ДИММЕРЫ",
      "РОЗЕТКИ",
      "ВЫКЛЮЧАТЕЛИ",
      "ТЁПЛЫЙ ПОЛ",
      "ПОТОЛОЧНЫЕ СВЕТИЛЬНИКИ",
    ],
    forHome: ["ПРОХОДНЫЕ", "ЛЕСТНИЧНЫЕ", "ПЛАСТИНЫ", "ТУМБЛЕРЫ"],
    information: ["ГЛАВНАЯ", "О КОМПАНИИ", "КОНТАКТЫ", "КАТАЛОГИ"],
  },
};

const mobileMenuStructure = {
  categories: [
    "САНТЕХНИКА",
    "ОСВЕЩЕНИЕ",
    "ДВЕРИ",
    "МЕБЕЛЬ",
    "ФУРНИТУРА",
    "КОЛЛЕКЦИИ",
    "ВДОХНОВЕНИЕ",
    "КАТАЛОГИ",
    "О НАС",
  ],
  deepDesign: ["ГЛАВНАЯ", "О КОМПАНИИ", "КОНТАКТЫ", "КАТАЛОГИ"],
};

// Handle dropdown hover
const handleMouseEnter = (menuTitle) => {
  if (dropdownMenus[menuTitle]) {
    activeDropdown.value = menuTitle;
    activeSubDropdown.value = null;
  }
};

const handleMouseLeave = () => {
  // Add small delay to prevent flickering
  setTimeout(() => {
    activeDropdown.value = null;
    activeSubDropdown.value = null;
  }, 100);
};

const handleSubMenuEnter = (subMenuKey) => {
  activeSubDropdown.value = subMenuKey;
};

// Mobile menu handlers
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    activeDropdown.value = null;
    activeSubDropdown.value = null;
  }
};

const handleMobileMenuClick = (menuTitle) => {
  if (dropdownMenus[menuTitle]) {
    if (activeDropdown.value === menuTitle) {
      activeDropdown.value = null;
      activeSubDropdown.value = null;
    } else {
      activeDropdown.value = menuTitle;
      activeSubDropdown.value = null;
    }
  } else {
    // Navigate to page
    router.push(
      menuItems.find((item) => item.title === menuTitle)?.link || "/"
    );
    toggleMobileMenu();
  }
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

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});
</script>

<template>
  <header
    class="w-full text-white flex items-center justify-between px-6 desktop:px-[60px] pt-[20px] pb-[20px] h-[80px] fixed top-0 left-0 z-50 font-TT text-[14px] tracking-[0.03em] transition-all duration-300"
    :class="activeDropdown ? 'bg-black' : 'bg-custom-gradient'"
  >
    <!-- Left: Logo + Desktop Menu -->
    <div class="flex items-center gap-[20px] relative">
      <img
        src="/logo-black.svg"
        class="h-[30px] desktop:h-[35px] cursor-pointer"
        @click="router.push('/')"
      />

      <!-- Desktop menu -->
      <nav class="hidden desktop:flex gap-[20px] relative">
        <div
          v-for="item in menuItems"
          :key="item.title"
          class="relative"
          @mouseenter="handleMouseEnter(item.title)"
        >
          <RouterLink
            :to="item.link"
            class="hover:opacity-70 transition-all cursor-pointer"
          >
            {{ item.title }}
          </RouterLink>
        </div>
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
  </header>

  <!-- Full Width Desktop Dropdown -->
  <transition name="fade">
    <div
      v-if="activeDropdown && dropdownMenus[activeDropdown]"
      class="fixed top-[80px] left-0 w-full bg-black text-white shadow-2xl z-40 hidden desktop:block"
      @mouseenter="activeDropdown = activeDropdown"
      @mouseleave="handleMouseLeave"
    >
      <div class="max-w-[1400px] mx-auto px-[60px] py-12">
        <div class="grid grid-cols-4 gap-12">
          <!-- Column 1: Categories -->
          <div>
            <h3
              class="text-gray-400 text-xs mb-6 uppercase tracking-[0.15em] font-medium"
            >
              Категории
            </h3>
            <div class="space-y-4">
              <div
                v-for="category in dropdownMenus[activeDropdown].categories"
                :key="category"
                class="text-white hover:text-gray-300 cursor-pointer transition-colors text-sm leading-relaxed"
                @click="router.push(`/${category.toLowerCase()}`)"
              >
                {{ category }}
              </div>
            </div>
          </div>

          <!-- Column 2: Deep Design / For Home -->
          <div>
            <h3
              class="text-gray-400 text-xs mb-6 uppercase tracking-[0.15em] font-medium"
            >
              {{ activeDropdown === "САНТЕХНИКА" ? "Deep Design" : "Для дома" }}
            </h3>
            <div class="space-y-4">
              <div
                v-for="subItem in activeDropdown === 'САНТЕХНИКА'
                  ? dropdownMenus[activeDropdown].deepDesign
                  : dropdownMenus[activeDropdown].forHome"
                :key="subItem"
                class="text-white hover:text-gray-300 cursor-pointer transition-colors text-sm leading-relaxed"
                @click="router.push(`/${subItem.toLowerCase()}`)"
              >
                {{ subItem }}
              </div>
            </div>
          </div>

          <!-- Column 3: Information -->
          <div>
            <h3
              class="text-gray-400 text-xs mb-6 uppercase tracking-[0.15em] font-medium"
            >
              Информация
            </h3>
            <div class="space-y-4">
              <div
                v-for="info in dropdownMenus[activeDropdown].information"
                :key="info"
                class="text-white hover:text-gray-300 cursor-pointer transition-colors text-sm leading-relaxed"
                @click="router.push(`/${info.toLowerCase()}`)"
              >
                {{ info }}
              </div>
            </div>
          </div>

          <!-- Column 4: Deep Design Description (only for САНТЕХНИКА) -->
          <div v-if="activeDropdown === 'САНТЕХНИКА'">
            <h4 class="text-gray-300 text-sm italic mb-4 font-light">
              Deep Design
            </h4>
            <p class="text-gray-400 text-xs leading-relaxed font-light">
              Разрабатывая и производя продукцию Deep-design, мы стремимся
              создать детали, которые дополнят ваше пространство, создавая
              полную гармоничную атмосферу как для знакомых событий, так и для
              повседневной рутины. Ведь наша жизнь состоит из множества
              маленьких событий, благодаря которым мы чувствуем себя дома.
              Пространство — это отражение как для знаковых событий, так и для
              повседневной рутины. Ведь наша жизнь состоит из множества
              маленьких событий, которые складываются в единое целое.
            </p>
          </div>

          <!-- Column 4: Alternative content for ФУРНИТУРА -->
          <div v-else-if="activeDropdown === 'ФУРНИТУРА'">
            <h4 class="text-gray-300 text-sm italic mb-4 font-light">
              Фурнитура
            </h4>
            <p class="text-gray-400 text-xs leading-relaxed font-light">
              Качественная фурнитура — это основа комфорта и функциональности
              вашего дома. Мы предлагаем широкий ассортимент продукции, которая
              сочетает в себе надежность, эстетику и современные технологии.
              Каждый элемент тщательно продуман для создания гармоничного
              пространства.
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Mobile Menu Overlay -->
  <transition name="fade">
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black text-white overflow-y-auto"
    >
      <!-- Mobile Menu Content -->
      <div class="px-6 py-6">
        <!-- Main Categories -->
        <div class="mb-8">
          <h3 class="text-gray-400 text-xs mb-4 uppercase tracking-wider">
            Категории
          </h3>
          <div class="space-y-4">
            <div v-for="item in menuItems" :key="item.title" class="block">
              <div
                class="flex items-center justify-between cursor-pointer"
                @click="handleMobileMenuClick(item.title)"
              >
                <span
                  class="text-white text-[16px] hover:opacity-70 transition-all"
                >
                  {{ item.title }}
                </span>
                <svg
                  v-if="dropdownMenus[item.title]"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-90': activeDropdown === item.title }"
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

              <!-- Mobile Submenu -->
              <transition name="slide-down">
                <div
                  v-if="
                    activeDropdown === item.title && dropdownMenus[item.title]
                  "
                  class="mt-4 ml-4 space-y-4 border-l border-gray-700 pl-4"
                >
                  <!-- Submenu Categories -->
                  <div>
                    <div class="space-y-2">
                      <div
                        v-for="category in dropdownMenus[item.title].categories"
                        :key="category"
                        class="text-gray-300 text-sm hover:text-white cursor-pointer transition-colors"
                        @click="
                          router.push(`/${category.toLowerCase()}`);
                          toggleMobileMenu();
                        "
                      >
                        {{ category }}
                      </div>
                    </div>
                  </div>

                  <!-- For Home / Deep Design section -->
                  <div class="pt-4 border-t border-gray-800">
                    <div
                      class="flex items-center justify-between cursor-pointer mb-2"
                      @click="
                        handleMobileSubMenuClick(
                          item.title === 'САНТЕХНИКА' ? 'deepDesign' : 'forHome'
                        )
                      "
                    >
                      <span
                        class="text-gray-400 text-xs uppercase tracking-wider"
                      >
                        {{
                          item.title === "САНТЕХНИКА"
                            ? "Deep Design"
                            : "Для дома"
                        }}
                      </span>
                      <svg
                        class="w-3 h-3 transition-transform duration-200"
                        :class="{
                          'rotate-90':
                            activeSubDropdown ===
                            (item.title === 'САНТЕХНИКА'
                              ? 'deepDesign'
                              : 'forHome'),
                        }"
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

                    <transition name="slide-down">
                      <div
                        v-if="
                          activeSubDropdown ===
                          (item.title === 'САНТЕХНИКА'
                            ? 'deepDesign'
                            : 'forHome')
                        "
                        class="space-y-2 ml-2"
                      >
                        <div
                          v-for="subItem in item.title === 'САНТЕХНИКА'
                            ? dropdownMenus[item.title].deepDesign
                            : dropdownMenus[item.title].forHome"
                          :key="subItem"
                          class="text-gray-300 text-sm hover:text-white cursor-pointer transition-colors"
                          @click="
                            router.push(`/${subItem.toLowerCase()}`);
                            toggleMobileMenu();
                          "
                        >
                          {{ subItem }}
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="pt-6 border-t border-gray-800 space-y-4">
          <div class="text-gray-400 text-xs">
            <div>+7 909 999 3517</div>
            <div class="mt-2">
              <div>Москва, ул. Свободы 35</div>
              <div>стр. 17</div>
              <div>будни с 9:00—19:00</div>
            </div>
          </div>

          <!-- Language Switch -->
          <div class="flex items-center gap-4 pt-4">
            <button
              @click="locale = 'ru'"
              :class="[
                'text-sm',
                locale === 'ru' ? 'text-white' : 'text-gray-400',
              ]"
            >
              RU
            </button>
            <button
              @click="locale = 'en'"
              :class="[
                'text-sm',
                locale === 'en' ? 'text-white' : 'text-gray-400',
              ]"
            >
              EN
            </button>
          </div>

          <!-- Social Icons -->
          <div class="flex gap-4 pt-4">
            <div
              class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span class="text-xs">W</span>
            </div>
            <div
              class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span class="text-xs">T</span>
            </div>
            <div
              class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span class="text-xs">P</span>
            </div>
            <div
              class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span class="text-xs">F</span>
            </div>
            <div
              class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span class="text-xs">I</span>
            </div>
            <div
              class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <span class="text-xs">Y</span>
            </div>
          </div>
        </div>
      </div>
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
