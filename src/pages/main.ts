import { createApp } from 'vue'
import ElementPlus from 'element-plus'
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
import { ElMessageBox } from 'element-plus'
import Particles from 'particles.vue3'
import './pwa'
import TagPurple from './components/tags/tag.purple.vue'

const app = createApp(App)

app.use(ElementPlus, {
  locale: elementPlusLang,
  size: 'default',
})
for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName)) {
    const item = ElIconModules[iconName]
    app.component(iconName, item)
  }
}
Locale.use('zh-CN', vantLang)
app.use(Vant)
app.component('TagPurple', TagPurple)
app.use(router)
app.use(store)
app.use(i18n)
app.use(Particles)
app.mount('#app')

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  ElMessageBox.alert('检测到该为深色模式，目前未适配。', '深色模式提醒', {
    center: true,
    type: 'warning',
  })
}
