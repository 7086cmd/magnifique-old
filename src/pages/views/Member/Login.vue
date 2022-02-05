<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script lang="ts" setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import baseurl from '../../modules/baseurl'
import getData from '../../components/get-data'
import { encode } from '../../components/record-data'

let isClient = ref(false)

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}
const { t } = useI18n()
const router = useRouter()

let number = ref('')
let password = ref('')
let name = ref('')

watch(number, () => {
  if (number.value.split('').length === 8) {
    axios({
      url: `${baseurl}member/getinfo/${number.value}/`,
    }).then((response) => {
      name.value = response.data.details.name
    })
  } else {
    name.value = '不存在'
  }
})

const login = () => {
  if (name.value == '不存在' || name.value == '') {
    ElMessageBox.alert('不存在登陆空气吗您', '登陆失败', {
      type: 'error',
      center: true,
    })
  } else {
    getData(`${baseurl}member/${number.value}/login`, 'get', {
      password: window.btoa(password.value),
    })
    axios(`${baseurl}member/${number.value}/login?password=${window.btoa(password.value)}`).then((response) => {
      if (response.data.status == 'ok') {
        let timeOut = 3
        ElMessageBox.alert(`${name.value}，欢迎使用。` + t('class.status.jump', { sec: timeOut }), '登陆成功', {
          type: 'success',
          center: true,
        }).then(() => {
          router.push('/member/')
        })
        sessionStorage.setItem(
          'memberLoginInfo',
          encode({
            number: number.value,
            password: window.btoa(password.value),
          })
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
      <el-button color="#626aef" plain style="width: 100%" @click="login"> 确定 </el-button>
    </el-form-item>
  </el-form>
</template>
