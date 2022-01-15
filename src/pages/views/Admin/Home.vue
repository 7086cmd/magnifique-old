<script lang="ts" setup>
import { ref, inject, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import { UserFilled as User, List, Back, Box, HomeFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { Close, Minus, Plus } from '@element-plus/icons-vue'

let isClient = ref(false)

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}
const closeServer = () => {
  window.magnifique.closeServer()
}
const minServerWindow = () => {
  window.magnifique.minServerWindow()
}
const maxServerWindow = () => {
  window.magnifique.maxServerWindow()
}
const router = useRouter()
const { t } = useI18n()
const leftDrawerOpen = ref(true)
let reset_password = ref(false)
let pageSelected = ref('1')
let newpwd = reactive({
  oldpwd: '',
  newpwd1: '',
  newpwd2: '',
})

if (localStorage.getItem('adminLoginInfo') == undefined) {
  if (inject('adminLoginInfo') == undefined) {
    router.push('/admin/login/')
  }
}
try {
  window.atob(String(localStorage.getItem('adminLoginInfo')))
} catch (e) {
  router.push('/admin/login/')
  localStorage.removeItem('adminLoginInfo')
}

const { password } = JSON.parse(window.atob(String(localStorage.getItem('adminLoginInfo'))))

axios({
  url: `${baseurl}admin/login?password=${password}`,
  data: {
    password: password,
  },
  method: 'get',
}).then((response) => {
  if (response.data.status !== 'ok') {
    localStorage.removeItem('adminLoginInfo')
    router.push('/admin/login')
  }
})
const npd = () => {
  if (newpwd.newpwd1 === newpwd.newpwd2) {
    axios({
      url: `${baseurl}admin/edit/password`,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      data: JSON.stringify({
        newp: window.btoa(newpwd.newpwd1),
        password,
      }),
    }).then((response) => {
      if (response.data.status == 'ok') {
        ElMessageBox.alert('成功', '修改密码', {
          type: 'success',
          center: true,
        }).then(() => {
          localStorage.removeItem('adminLoginInfo')
          router.push('/admin/login')
        })
      } else {
        ElMessageBox.alert(
          t('dialogs.' + response.data.reason, {
            msg: response.data.text,
          }),
          '错误',
          {
            type: 'error',
            center: true,
          }
        )
      }
    })
  } else {
    ElMessageBox.alert('密码输入不一致', '错误', {
      type: 'error',
      center: true,
    })
  }
}
const openPassword = () => {
  reset_password.value = true
}
const exit = () => {
  localStorage.removeItem('adminLoginInfo')
  router.push('/admin/login')
}
</script>
<template>
  <el-container>
    <el-aside width="12%">
      <el-menu v-model="pageSelected" default-active="/admin/" :collapse="leftDrawerOpen" style="min-height: 1024px; padding-top: 2em" collapse-transition router>
        <el-menu-item index="/">
          <el-icon>
            <Back />
          </el-icon>
          <template #title> 返回主页 </template>
        </el-menu-item>
        <el-menu-item index="/admin/">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <template #title> 主页 </template>
        </el-menu-item>
        <el-menu-item index="/admin/data/">
          <el-icon>
            <List />
          </el-icon>
          <template #title> 数据管理 </template>
        </el-menu-item>
        <el-menu-item index="/admin/member/">
          <el-icon>
            <User />
          </el-icon>
          <template #title> 成员管理 </template>
        </el-menu-item>
        <el-menu-item index="/admin/message/">
          <el-icon>
            <Box />
          </el-icon>
          <template #title> 消息中心 </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right">
        <el-dropdown split-button plain>
          <el-icon>
            <User />
          </el-icon>
          管理员
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon>
                  <MessageBox />
                </el-icon>
                {{ t('class-dropdown.feed-back') }}
              </el-dropdown-item>
              <el-dropdown-item command="new_password" @click="openPassword">
                <el-icon>
                  <Edit />
                </el-icon>
                {{ t('class-dropdown.edit-password') }}
              </el-dropdown-item>
              <el-dropdown-item @click="exit">
                <el-icon>
                  <Close />
                </el-icon>
                {{ t('class-dropdown.log-out') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-divider v-if="isClient" direction="vertical" />
        <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()" />
        <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()" />
        <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()" />
      </el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
        <el-drawer v-model="reset_password" title="修改密码" direction="btt" size="60%">
          <el-form v-model="newpwd">
            <el-form-item label="原密码">
              <el-input v-model="newpwd.oldpwd" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="newpwd.newpwd1" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="newpwd.newpwd2" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button plain @click="reset_password = false"> 取消 </el-button>
              <el-button type="primary" plain @click="npd"> 确定 </el-button>
            </el-form-item>
          </el-form>
        </el-drawer>
      </el-main>
    </el-container>
  </el-container>
</template>
