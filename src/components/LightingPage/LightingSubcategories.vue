<template>
  <div
    class="border-t border-l mx-5 border-[#101010] grid grid-cols-1 desktop:grid-cols-2"
  >
    <div
      v-for="item in items"
      :key="item.title"
      class="border-b p-[30px] border-r border-[#101010] flex flex-col"
    >
      <!-- Image -->
      <div
        class="w-full h-[200px] desktop:h-[340px] bg-cover bg-center"
        :style="{ backgroundImage: `url(${item.image || defaultImage})` }"
      ></div>

      <!-- Title + Count -->
      <div class="flex justify-between items-center mt-5 uppercase">
        <span class="text-[14px] font-bold desktop:text-[18px]">{{
          item.title
        }}</span>
        <span class="text-[10px] desktop:text-[12px]">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const defaultImage = new URL("../../assets/mainPage/doors.png", import.meta.url)
  .href;

const items = [
  {
    title: "Диммеры",
    count: 34,
    image: "", // fallback image
  },
  {
    title: "Розетки",
    count: 45,
    image: "",
  },
  {
    title: "Выключатели",
    count: 8,
    image: "",
  },
  {
    title: "Тёплый пол",
    count: 120,
    image: "",
  },
  {
    title: "Потолочные светильники",
    count: 20,
    image: "",
  },
];
</script>
