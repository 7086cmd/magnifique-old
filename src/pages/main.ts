import { createApp } from 'vue'
import ElementPlus, { ElIcon } from 'element-plus'
import * as ElIconModules from '@element-plus/icons-vue'
import elementPlusLang from 'element-plus/es/locale/lang/zh-cn'
import Vant from 'vant'
import { Locale } from 'vant'
import vantLang from 'vant/es/locale/lang/zh-CN'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import './index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

const myApp = createApp(App)

myApp.use(ElementPlus, {
  locale: elementPlusLang,
})
myApp.component('ElIcon', ElIcon)
for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName)) {
    const item = ElIconModules[iconName]
    myApp.component(iconName, item)
  }
}
Locale.use('zh-CN', vantLang)
myApp.use(Vant)
myApp.use(router)
myApp.use(store)
myApp.use(i18n)
myApp.mount('#app')
