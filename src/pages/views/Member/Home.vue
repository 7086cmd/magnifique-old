<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import { UserFilled as User, List, Back, Box, Odometer, Magnet, Tools } from '@element-plus/icons-vue'
import ControlsPage from '../../components/controls-page.vue'

let heightClient = ref(window.innerHeight)

const list = {
  主席团: 'zxt',
  纪检部: 'jjb',
  文体部: 'wtb',
  宣传部: 'xcb',
  青志部: 'qzb',
  学习部: 'xxb',
}
let isClient = ref(false)
const router = useRouter()
const leftDrawerOpen = ref(true)
let pageSelected = ref('1')
let name = ref('')
let inGroup = ref('')
let inCfg = ref(false)

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

if (sessionStorage.getItem('memberLoginInfo') == undefined) {
  if (inject('memberLoginInfo') == undefined) {
    router.push('/class/member/')
  }
}
try {
  window.atob(String(sessionStorage.getItem('memberLoginInfo')))
} catch (e) {
  router.push('/class/member/')
  sessionStorage.removeItem('memberLoginInfo')
}

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))

axios(`${baseurl}member/getinfo/${number}/`).then((response) => {
  name.value = response.data.details.name
  inGroup.value = response.data.details.in
  if (response.data.details.do.split('').reverse()[0] == '长' || response.data.details.do.split('').reverse()[0] == '席') {
    inCfg.value = true
  }
})

axios({
  url: `${baseurl}member/${number}/login?password=${password}`,
  data: {
    password: password,
  },
  method: 'get',
}).then((response) => {
  if (response.data.status !== 'ok') {
    sessionStorage.removeItem('memberLoginInfo')
    router.push('/member/login')
  }
})
</script>
<template>
  <el-container>
    <el-aside width="12%">
      <el-menu v-model="pageSelected" default-active="/member/" :collapse="leftDrawerOpen" style="min-height: 1024px; padding-top: 2em" collapse-transition router>
        <el-menu-item index="/class/">
          <el-icon>
            <Back />
          </el-icon>
          <template #title> 返回主页 </template>
        </el-menu-item>
        <el-menu-item index="/member/">
          <el-icon>
            <Odometer />
          </el-icon>
          <template #title> 仪表盘 </template>
        </el-menu-item>
        <el-menu-item index="/member/workflow/">
          <el-icon>
            <List />
          </el-icon>
          <template #title> 工作流 </template>
        </el-menu-item>
        <el-menu-item index="/member/information/">
          <el-icon>
            <User />
          </el-icon>
          <template #title> 个人信息 </template>
        </el-menu-item>
        <el-menu-item v-if="inGroup !== '主席团'" :index="`/member/department/`">
          <el-icon>
            <Tools />
          </el-icon>
          <template #title> 部门功能 </template>
        </el-menu-item>
        <el-menu-item v-if="inCfg" :index="'/member/admin/'">
          <el-icon>
            <Magnet />
          </el-icon>
          <template #title> 管理 </template>
        </el-menu-item>
        <el-menu-item index="/member/message/">
          <el-icon>
            <Box />
          </el-icon>
          <template #title> 消息中心 </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right">
        <el-affix :offset="20">
          <controls-page type="member" :number="number" :name="name" />
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
</template>
