import {defineStore} from 'pinia'
import {Ref, ref} from "vue";

export const AppStore = defineStore('app', () => {
    type Language = 'ru' | 'en'
    let language: Ref<Language> = ref('ru')

    return {language}
}, {persist: true})
