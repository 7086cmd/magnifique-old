<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import dayjs from 'dayjs'
import baseurl from '../../../modules/baseurl'
import { Ref, ref } from 'vue'

let choice = ref('document')

let isFetchingData = ref(false)
let allData: Ref<any[]> = ref([])
const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
const refresh = async () => {
  isFetchingData.value = true
  const response = await axios({
    url: `${baseurl}member/jjb/${number}/work/get/deduction?password=${password}`,
    method: 'get',
  })
  isFetchingData.value = false
  if (response.data.status == 'ok') {
    allData.value = response.data.details
    for (let i = 0; i in allData.value; i++) {
      allData.value[i].time = dayjs(allData.value[i].time).format('YYYY/MM/DD HH:mm:ss')
      allData.value[i]['personnum'] = allData.value[i].person
    }
  }
}
</script>

<template>
  <div>
    <el-tabs v-model="choice" tab-position="left">
      <el-tab-pane label="投稿数据" name="document">
        <el-skeleton :loading="isFetchingData" :rows="4" animated>
          <template #default>
            <el-table :data="allData" max-height="640px"></el-table>
          </template>
        </el-skeleton>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
