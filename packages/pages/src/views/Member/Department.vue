<script setup lang="ts">
/* global member */
import { ref, watch } from 'vue'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import volunteerPage from './departments/volunteer.vue'
import personExample from '../../../examples/person'
import DeductionPage from '../../components/powers/deduction/deduction.vue'
import PostPage from '../../components/powers/post/post.vue'
import { useRoute, useRouter } from 'vue-router'

const fetched = ref(false)
const route = useRoute()
const router = useRouter()
const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
let choice = ref(route.params.type ?? '')
let me = ref<member>(personExample())
axios(`${baseurl}member/getinfo/${number}/raw`).then(response => {
  me.value = response.data.details as member
  fetched.value = true
})
watch(choice, () => {
  router.push('/member/department/' + (choice.value ?? '') + (choice.value ? '/' : ''))
})
</script>

<template>
  <div>
    <el-tabs v-model="choice" v-loading="!fetched" tab-position="left">
      <el-tab-pane label="义工" name="volunteer" lazy>
        <volunteer-page />
      </el-tab-pane>
      <el-tab-pane label="投稿" name="post" lazy>
        <post-page type="member" :number="number" :password="password" />
      </el-tab-pane>
      <el-tab-pane v-if="me.union.duty.includes('deduction') && me.union.position !== 'register'" lazy label="扣分" name="deduction">
        <deduction-page type="member" :number="number" :password="password" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
