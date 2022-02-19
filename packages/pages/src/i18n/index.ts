import zh from './locales/zh-cn'
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': zh,
  },
  legacy: false,
})
export default i18n
