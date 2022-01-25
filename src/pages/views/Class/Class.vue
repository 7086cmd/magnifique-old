<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import { UserFilled as User, HomeFilled as Home, List, Back, PieChart, Box } from '@element-plus/icons-vue'
import ControlsPage from '../../components/controls-page.vue'

let heightClient = ref(window.innerHeight)

setInterval(() => {
  heightClient.value = window.innerHeight
}, 200)

let isClient = ref(false)
const router = useRouter()
const { t } = useI18n()
const leftDrawerOpen = ref(true)
let pageSelected = ref('1')

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

if (localStorage.getItem('classLoginInfo') == undefined || localStorage.getItem('classLoginInfo') == null) {
  if (inject('classLoginInfo') == undefined) {
    router.push('/')
  }
}

try {
  window.atob(String(localStorage.getItem('classLoginInfo')))
} catch (e) {
  router.push('/')
  localStorage.removeItem('classLoginInfo')
}

const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))

const reqUrl = `${baseurl}class/${gradeid}/${classid}/login?password=${password}`
axios({
  url: reqUrl,
  data: {
    password: password,
  },
  method: 'get',
}).then((response) => {
  if (response.data.status !== 'ok') {
    localStorage.removeItem('classLoginInfo')
    router.push('/class/login')
  } else {
    if (isClient.value) {
      window.magnifique.describeNotification(gradeid, classid)
    }
  }
})
</script>
<template>
  <el-container>
    <el-container>
      <el-aside width="12%">
        <el-menu v-model="pageSelected" default-active="/class/" :collapse="leftDrawerOpen" collapse-transition router :style="'padding-top: 2em; height: ' + String(heightClient) + 'px'">
          <el-menu-item index="/">
            <el-icon>
              <Back />
            </el-icon>
            <template #title>{{ t('class-home.menu.1') }}</template>
          </el-menu-item>
          <el-menu-item index="/class/">
            <el-icon>
              <Home />
            </el-icon>
            <template #title>{{ t('class-home.menu.2') }}</template>
          </el-menu-item>
          <el-menu-item index="/class/list/">
            <el-icon>
              <List />
            </el-icon>
            <template #title>{{ t('class-home.menu.3') }}</template>
          </el-menu-item>
          <el-menu-item index="/class/chart/">
            <el-icon>
              <PieChart />
            </el-icon>
            <template #title>{{ t('class-home.menu.4') }}</template>
          </el-menu-item>
          <el-menu-item index="/class/member/">
            <el-icon>
              <User />
            </el-icon>
            <template #title>{{ t('class-home.menu.5') }}</template>
          </el-menu-item>
          <el-menu-item index="/class/message/">
            <el-icon>
              <Box />
            </el-icon>
            <template #title>{{ t('class-home.menu.6') }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header reveal bordered class="bg-white text-black" style="text-align: right">
          <el-affix :offset="20">
            <controls-page type="class" :gradeid="gradeid" :classid="classid" />
          </el-affix>
        </el-header>
        <el-main>
          <el-scrollbar always :height="Math.floor((heightClient * 4) / 5)">
            <router-view v-slot="{ Component }">
              <el-scrollbar always>
                <transition name="fade">
                  <el-scrollbar always>
                    <component :is="Component" />
                  </el-scrollbar>
                </transition>
              </el-scrollbar>
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
