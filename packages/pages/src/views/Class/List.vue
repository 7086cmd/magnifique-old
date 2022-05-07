<script lang="ts" setup>
import { ref, watch } from 'vue'
import deduction from '../../components/powers/deduction/deduction.vue'
import post from '../../components/powers/post/post.vue'
import volunteer from './lists/volunteer.vue'
import memberDev from '../../components/powers/member/Member.vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let page = ref(route.params.page ?? '')
watch(page, () => {
  router.push('/class/list/' + page.value + '/')
})
const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-tabs v-model="page" tab-position="left" style="padding-top: 10%">
        <el-tab-pane label="成员" name="member">
          <member-dev :gradeid="gradeid" :classid="classid" :password="password" type="class" />
        </el-tab-pane>
        <el-tab-pane label="扣分" name="deduction">
          <deduction :gradeid="gradeid" :classid="classid" :password="password" type="class" />
        </el-tab-pane>
        <el-tab-pane label="稿件" name="post">
          <post :gradeid="gradeid" :classid="classid" :password="password" type="class" />
        </el-tab-pane>
        <el-tab-pane label="义工" name="volunteer">
          <volunteer />
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>
