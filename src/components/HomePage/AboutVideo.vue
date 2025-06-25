<script setup lang="ts">
import createClient from "openapi-fetch";
import { components, paths } from "../../types/schema";
import { onMounted, onUnmounted, ref, Ref } from "vue";
import router from "../../router";
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

interface IProps {
  showreel: boolean;
  about: boolean;
}

withDefaults(defineProps<IProps>(), {
  showreel: true,
  about: true,
});

const HOST = import.meta.env.VITE_HOST_NAME;
const { GET } = createClient<paths>({ baseUrl: HOST });
let video: HTMLVideoElement | null;

const playing = ref(false);

const videoFile: Ref<components["schemas"]["MainVideo"] | undefined> = ref();

async function fetchVideo() {
  const { data, error } = await GET("/api/main_video/", {});
  if (error) return;
  videoFile.value = data;
}

onMounted(() => {
  fetchVideo();
});

function playVideo() {
  if (playing.value) {
    pauseVideo();
    return;
  }
  playing.value = true;
  let player = document.getElementById("videoPlayer") as HTMLVideoElement;
  if (!player) return;
  player.play();
}

function pauseVideo() {
  playing.value = false;
  let player = document.getElementById("videoPlayer") as HTMLVideoElement;
  if (!player) return;
  player.pause();
}

function onVideoEnd() {
  if (video) {
    playing.value = false;
    video.pause();
    video.currentTime = 0;
  }
}

onMounted(() => {
  let timer = setInterval(() => {
    if (document.getElementById("videoPlayer") as HTMLVideoElement) {
      video = document.getElementById("videoPlayer") as HTMLVideoElement;
      console.log("set");
      video.addEventListener("ended", onVideoEnd, false);
      clearInterval(timer);
    }
  }, 500);
});

onUnmounted(() => {
  if (video) {
    removeEventListener("ended", onVideoEnd);
  }
});
</script>

<template>
  <div v-if="videoFile" class="w-full h-full relative bg-black text-white">
    <div class="title text-[40px] hidden desktop:absolute top-9 left-6">
      {{ t("video.name") }}
    </div>
    <!--    <div class="title absolute desktop:top-[30px] top-[20px] left-[20px] desktop:left-[30px]">{{t('video.name')}}</div>-->
    <video
      playsInline
      v-if="videoFile.file"
      poster="../../assets/poster.png"
      @click="playVideo"
      :src="videoFile.file"
      id="videoPlayer"
      class="w-full h-full flex items-center object-cover justify-center"
    ></video>
    <img
      @click="playVideo"
      src="../../assets/Play.svg"
      :class="{ hidden: playing }"
      class="desktop:w-[100px] w-[60px] cursor-pointer aspect-square absolute top-1/2 right-1/2 -mt-[30px] -mr-[30px] desktop:-mt-[50px] desktop:-mr-[50px]"
    />
    <div class="flex desktop:absolute gap-6">
      <div
        class="flex absolute bottom-[30px] left-[20px] desktop:left-[30px] gap-6"
      >
        <button
          v-if="about"
          @click="router.push('/about')"
          class="border pt-1 whitespace-nowrap cursor-pointer border-white hover:bg-white hover:text-black font-bold font-TT desktop:text-[18px] text-[16px] desktop:leading-[18px] leading-[16px] desktop:w-[240px] w-[120px] desktop:h-[35px] h-[35px]"
        >
          {{ t("video.about") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
