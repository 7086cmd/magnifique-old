<script lang="ts" setup>
import { ref } from 'vue'
import controls from '../components/controls.vue'
import ClassLogin from './Class/ClassLogin.vue'
import { useRouter } from 'vue-router'
import AdminLogin from './Admin/Login.vue'

const router = useRouter()
const choice = ref('class')

const toTag = (tag: string) => {
  router.push('/' + tag + '/')
}
</script>

<template>
  <div>
    <el-container>
      <el-header style="text-align: right">
        <controls />
      </el-header>
      <el-container>
        <el-aside width="5%"></el-aside>
        <el-main>
          <h2>登录</h2>
          <el-tabs v-model="choice">
            <el-tab-pane name="class" label="班级登录">
              <class-login></class-login>
              <el-button style="width: 100%" plain @click="toTag('class')">直接进</el-button>
            </el-tab-pane>
            <el-tab-pane name="admin" label="管理员登录">
              <admin-login></admin-login>
              <el-button style="width: 100%" plain @click="toTag('admin')">直接进</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-main>
        <el-aside width="5%"> </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
