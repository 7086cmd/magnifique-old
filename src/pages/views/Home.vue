<script lang="ts" setup>
import { ref } from 'vue'
import controls from '../components/controls.vue'
import ClassLogin from './Class/ClassLogin.vue'
import { useRouter } from 'vue-router'
import AdminLogin from './Admin/Login.vue'
import { loadFountainPreset } from 'tsparticles-preset-fountain'

const router = useRouter()
const choice = ref('class')

const toTag = (tag: string) => {
  router.push('/' + tag + '/')
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const init = (main: any) => {
  loadFountainPreset(main)
}
</script>

<template>
  <div className="background_must_be_gray">
    <Particles id="tsparticles" :particles-init="init"></Particles>
    <el-container>
      <el-header style="text-align: right; height: 30%">
        <controls />
      </el-header>
      <el-container>
        <el-aside width="30%"></el-aside>
        <el-main style="padding-top: 15%">
          <Particles id="tsparticles" />
          <el-card shadow="never">
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
          </el-card>
        </el-main>
        <el-aside width="30%"> </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
