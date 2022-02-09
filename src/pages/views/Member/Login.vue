<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script lang="ts" setup>
/* global member_processed */
import { ref, watch } from 'vue'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import baseurl from '../../modules/baseurl'
import getData from '../../components/get-data'
import { encode } from '../../components/record-data'
import failfuc from '../../modules/failfuc'

const { gradeid, classid, password: passwordClass } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))

let options = ref<member_processed[]>([])
axios(`${baseurl}class/${gradeid}/${classid}/member/get?password=${passwordClass}`).then((response) => {
  if (response.data.status == 'ok') {
    options.value = response.data.details
  }
})

let isClient = ref(false)

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}
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
        ElMessageBox.alert(`${name.value}，欢迎使用。`, '登陆成功', {
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
        failfuc(response.data.reason, response.data.text)
      }
    })
  }
}
</script>

<template>
  <el-form>
    <!-- <el-form-item label="学号">
      <el-input v-model="number" />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="name" readonly />
    </el-form-item> -->
    <el-form-item label="姓名">
      <el-select v-model="number" style="width: 100%">
        <el-option v-for="item in options" :key="item.number" :value="item.number" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button color="#626aef" style="color: white; width: 100%" plain @click="login"> 确定 </el-button>
    </el-form-item>
  </el-form>
</template>
