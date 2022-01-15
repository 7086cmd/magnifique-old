<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script lang="ts" setup>
import { ref, watch, provide } from 'vue'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import baseurl from '../../modules/baseurl'
import { Close, Minus, Plus, ArrowLeft } from '@element-plus/icons-vue'

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
const { t } = useI18n()
const router = useRouter()

let number = ref('')
let password = ref('')
let name = ref('')

watch(
  () => number.value,
  () => {
    if (number.value.split('').length === 8) {
      axios({
        url: `${baseurl}member/getinfo/${number.value}/`,
      }).then((response) => {
        name.value = response.data.details.name
      })
    } else {
      name.value = '不存在'
    }
  }
)

const login = () => {
  if (name.value == '不存在' || name.value == '') {
    ElMessageBox.alert('不存在登陆空气吗您', '登陆失败', {
      type: 'error',
      center: true,
    })
  } else {
    axios({
      url: `${baseurl}member/${number.value}/login?password=${window.btoa(password.value)}`,
    }).then((response) => {
      if (response.data.status == 'ok') {
        let timeOut = 3
        ElMessageBox.alert(`${name.value}，欢迎使用。` + t('class.status.jump', { sec: timeOut }), '登陆成功', {
          type: 'success',
          center: true,
        }).then(() => {
          router.push('/member/')
        })
        provide(
          'memberLoginInfo',
          window.btoa(
            JSON.stringify({
              number: number.value,
              password: window.btoa(password.value),
            })
          )
        )
        sessionStorage.setItem(
          'memberLoginInfo',
          window.btoa(
            JSON.stringify({
              number: number.value,
              password: window.btoa(password.value),
            })
          )
        )
        setTimeout(() => {
          router.push('/member/')
        }, 3000)
      } else {
        localStorage.removeItem('memberLoginInfo')
        ElMessageBox.alert(
          t('dialogs.' + response.data.reason, {
            msg: response.data.text,
          }),
          '登陆失败',
          {
            type: 'error',
            center: true,
          }
        )
      }
    })
  }
}
</script>

<template>
  <el-container>
    <el-header>
      <div style="text-align: right">
        <el-button v-if="isClient" style="text-align: left" :icon="ArrowLeft" type="primary" circle plain size="small" @click="toHome()" />
        <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()" />
        <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()" />
        <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()" />
      </div>
    </el-header>
    <el-container>
      <el-aside width="5%" />
      <el-main>
        <div class="row">
          <div class="col-2" />
          <div class="col">
            <h3>成员登录</h3>
            <el-form>
              <el-form-item label="学号">
                <el-input v-model="number" />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="name" readonly />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" plain style="width: 100%" @click="login"> 确定 </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="col-2" />
        </div>
      </el-main>
      <el-aside width="5%" />
    </el-container>
  </el-container>
</template>
