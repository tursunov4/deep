<script setup lang="ts">
import {AppStore} from "../../store/AppStore.ts";
import {computed, ref, watch} from "vue";
import {HeaderStore} from "../../store/HeaderStore.ts";
import {useI18n} from "vue-i18n";
import { useToggleSection } from "../../composables/useToggleSection.ts";

const props = defineProps<{
  visible?: boolean
}>()

const {t} = useI18n({useScope: 'global'})
const App = AppStore()
const Header = HeaderStore()
const { toggleSection } = useToggleSection();

const collectionsElement = ref<HTMLElement | undefined>()

const selectedCollectionsIndex = computed(() => Header.collections.collections.findIndex(collection => collection.id === Header.collections.selectedCollectionId))

watch(props, (newProps) => {
  if (!newProps.visible) {
    console.log('collapsing')
    const collapsed = collectionsElement.value?.getAttribute('data-collapsed') === 'true';
    if (!collapsed) toggleSection(collectionsElement.value)
    isCollapsed.value = collectionsElement.value?.getAttribute('data-collapsed') === 'true'
  }
})
const isCollapsed = ref(true)

</script>

<template>
  <div :class="visible ? 'opacity-0':'opacity-100'" class="w-full font-TT tracking-[0.045rem] uppercase relative px-[20px] desktop:px-0 font-bold text-base flex h-full">
    <div @click="toggleSection(collectionsElement); isCollapsed=!isCollapsed"
         class="grid cursor-pointer justify-stretch desktop:border border-b border-black grid-cols-[1fr_3fr_1fr] w-full items-center justify-items-center">
      <template
          v-if="selectedCollectionsIndex < 0">
        <div/>
        <div>{{ t('featured_collection.all_collections')}}</div>
        <div :class="isCollapsed ? 'rotate-180 transform origin-center' : ''" class="mdi duration-500 transition-all mdi-triangle"/>
      </template>
      <template v-else>
        <div>{{ ('0' + (selectedCollectionsIndex + 1)).slice(-2) }}</div>
        <div>{{ App.language == 'ru' ?  Header.collections.collections[selectedCollectionsIndex].rus_name : Header.collections.collections[selectedCollectionsIndex].rus_name }}</div>
        <div class="">{{ Header.collections.collections[selectedCollectionsIndex].year }}</div>
      </template>
    </div>
    <div ref="collectionsElement" :style="{'height': '0'}" data-collapsed="true" class="absolute section -mx-[4px] transition-all bg-white desktop:py-0 overflow-y-auto  duration-500 overflow-hidden top-full w-full left-[4px]">
      <div class="py-[30px] desktop:py-0">
        <div @click="Header.collections.selectedCollectionId = collection.id; Header.collections.needsScroll=true; toggleSection(collectionsElement); isCollapsed = true"
             class="grid cursor-pointer desktop:bg-black-general desktop:text-white/70 bg-white px-[20px] desktop:px-0 hover:desktop:text-white/100 justify-stretch aspect-[370/80] grid-cols-[1fr_3fr_1fr] w-full items-center justify-items-center"
             v-for="(collection, index) in Header.collections.collections">
          <div>{{ ('0' + (index+1)).slice(-2) }}</div>
          <div>{{ App.language == 'ru' ? collection.rus_name : collection.eng_name }}</div>
          <div class="">{{ collection.year }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
