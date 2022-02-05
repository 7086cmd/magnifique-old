<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import baseurl from '../../modules/baseurl'
import failfuc from '../../modules/failfuc'
const { t } = useI18n()
const router = useRouter()
let gradeid = ref('')
let classid = ref(0)
let password = ref('')
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

async function login() {
  let grade = parseInt(gradeid.value)
  if (isNaN(Number(classid.value))) {
    failfuc('输入的不是班级', '')
    return
  }
  axios(`${baseurl}class/${grade}/${Number(classid.value)}/login?password=${window.btoa(password.value)}`).then((response) => {
    if (response.data.status == 'ok') {
      ElMessageBox.alert('3秒后进入主界面', '登陆成功', {
        type: 'success',
        center: true,
      }).then(() => {
        router.push('/class/')
      })
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
      failfuc(response.data.reason, response.data.text)
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
        <el-input v-model="password" outlined style="width: 100%" type="password" :label="t('class.password')"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :label="t('submit')" outline plain color="#626aef" style="width: 100%" @click="login">
          {{ t('submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </transition>
</template>
