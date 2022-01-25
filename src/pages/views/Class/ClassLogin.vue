<script lang="ts" setup>
import { ref, provide } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import baseurl from '../../modules/baseurl'

let isClient = ref(false)
const { t } = useI18n()
const router = useRouter()
let gradeid = ref('')
let classid = ref(0)
let password = ref('')
let isPwd = ref(true)
const grades = [
  {
    label: '初一',
    value: '1',
  },
  {
    label: '初二',
    value: '2',
  },
  {
    label: '初三',
    value: '3',
  },
]

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

async function login() {
  let grade = parseInt(gradeid.value)
  if (isNaN(Number(classid.value))) {
    ElMessageBox.alert('输入的不是班级', '错误', {
      center: true,
      type: 'error',
    })
    return
  }
  axios({
    url: `${baseurl}class/${grade}/${Number(classid.value)}/login?password=${window.btoa(password.value)}`,
    method: 'get',
  }).then((response) => {
    if (response.data.status == 'ok') {
      let timeOut = 3
      ElMessageBox.alert(t('class.status.jump', { sec: timeOut }), t('class.status.success'), {
        type: 'success',
        center: true,
      }).then(() => {
        router.push('/class/')
      })
      provide(
        'classLoginInfo',
        window.btoa(
          JSON.stringify({
            gradeid: grade,
            classid: Number(classid.value),
            password: window.btoa(password.value),
          })
        )
      )
      localStorage.setItem(
        'classLoginInfo',
        window.btoa(
          JSON.stringify({
            gradeid: grade,
            classid: Number(classid.value),
            password: window.btoa(password.value),
          })
        )
      )
      setTimeout(() => {
        router.push('/class/')
      }, 3000)
    } else {
      localStorage.removeItem('classLoginInfo')
      ElMessageBox.alert(
        t('dialogs.' + response.data.reason, {
          msg: response.data.text,
        }),
        t('class.status.error'),
        {
          type: 'error',
          center: true,
        }
      )
    }
  })
}
</script>
<template>
  <transition name="el-zoom-in-top" appear>
    <el-form @submit="login">
      <el-form-item label="年级">
        <el-select v-model="gradeid" outlined :placeholder="t('please-choose')" style="width: 100%" :label="t('class.grade')">
          <el-option v-for="item in grades" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="classid" outlined style="width: 100%" :label="t('class.class')" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" outlined style="width: 100%" :type="isPwd ? 'password' : 'text'" :label="t('class.password')">
          <template #append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :label="t('submit')" outline plain type="primary" style="width: 100%" @click="login">
          {{ t('submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </transition>
</template>
