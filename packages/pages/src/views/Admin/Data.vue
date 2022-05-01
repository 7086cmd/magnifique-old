<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch } from 'vue'
import Deduction from '../../components/powers/deduction/deduction.vue'
import PostDev from '../../components/powers/post/post.vue'
import Volunteer from './data/volunteer.vue'
import Member from './Member.vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let nativeName = ref(route.params.type ?? '')
const { password } = JSON.parse(window.atob(String(localStorage.getItem('adminLoginInfo'))))
watch(nativeName, () => {
  router.push('/admin/data/' + nativeName.value + (nativeName.value ? '/' : ''))
})
</script>

<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-tabs v-model="nativeName" tab-position="left" style="padding-top: 10%">
        <el-tab-pane label="扣分" name="deduction">
          <deduction type="admin" :password="password" />
        </el-tab-pane>
        <el-tab-pane label="稿件" name="post">
          <post-dev type="admin" :password="password" />
        </el-tab-pane>
        <el-tab-pane label="义工" name="volunteer">
          <volunteer />
        </el-tab-pane>
        <el-tab-pane label="成员" name="member">
          <member />
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>
