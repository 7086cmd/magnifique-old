<script setup lang="ts">
/* global member */
import { ref } from 'vue'
import axios from 'axios'
import baseurl from '../../../modules/baseurl'
import MemberPage from './member.vue'
import DeductionPage from './deduction.vue'
import personExample from '../../../../examples/person'
import { ElLoading } from 'element-plus'
const { number } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
let choice = ref('')
let me = ref<member>(personExample())
const loader = ElLoading.service({
  text: '获取信息中...',
})
axios(`${baseurl}member/getinfo/${number}/raw`).then((response) => {
  me.value = response.data.details as member
  loader.close()
})
</script>

<template>
  <div>
    <el-tabs v-model="choice" tab-position="left">
      <el-tab-pane v-if="me.union.admin.includes('member')" label="成员管理" name="member">
        <member-page />
      </el-tab-pane>
      <el-tab-pane v-if="me.union.admin.includes('deduction')" label="扣分数据" name="deduction">
        <deduction-page />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
