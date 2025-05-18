import { I18n, createI18n } from 'vue-i18n';
import localeRu from "./locales/ru.json";
import localeEn from "./locales/en.json";

const i18n: I18n = createI18n({
    locale: 'ru',
    legacy: false,
    globalInjection: true,
    messages: {
        ru: localeRu,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        en: localeEn
    }
    });

export default i18n
