import {defineStore} from 'pinia'
import {ref} from "vue";
import {HeaderCollections} from "../types/types.ts";

export const HeaderStore = defineStore('header', () => {
    let collections = ref<HeaderCollections>({
        visible: false,
        selectedCollectionId: -1,
        collections: [],
        needsScroll: false
    })
    return {collections}
})
