import en from './locales/en-us'
import zh from './locales/zh-cn'
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
    locale: navigator.languages[0],
    messages: {
        'zh-CN': zh,
        'en-US': en,
        en,
    },
    legacy: false,
})
export default i18n
