/** @format */

import zh from "./locales/zh-cn.json";
import en from "./locales/en.json";
import { createI18n } from "vue-i18n";
const i18n = createI18n({
  locale: "zh-CN",
  messages: {
    "zh-CN": zh,
    en,
  },
  legacy: false,
});
export default i18n;
