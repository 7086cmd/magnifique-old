<script setup lang="ts">
/* global DeductionList */
import { ref, reactive } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElLoading } from 'element-plus'
import baseurl from '../../../modules/baseurl'
import sucfuc from '../../../modules/sucfuc'
import failfuc from '../../../modules/failfuc'
import DeductionDescription from '../../../components/lists/DeductionDescription.vue'

let data = reactive({
  deduction: [],
})
const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
let loading = ref(false)
let search = ref('')
const tableRowClassName = (props: { row: DeductionList }) => {
  const statuses = {
    processing: 'warning-row',
    failed: 'error-row',
    normal: '',
  }
  return statuses[props.row.status]
}
const refresh = async () => {
  loading.value = true
  data.deduction = (await axios(`${baseurl}member/admin/${number}/get/all/deduction?password=${password}`)).data.details
  for (let i = 0; i in data.deduction; i++) {
    data.deduction[i].time = dayjs(data.deduction[i].time).format('YYYY/MM/DD')
  }
  loading.value = false
}
const deleteDeduction = async (props: { row: DeductionList }) => {
  const delLoad = ElLoading.service({
    text: '正在删除扣分，请稍后',
  })
  const response = await axios(`${baseurl}member/admin/${number}/del/deduction`, {
    method: 'post',
    data: {
      id: props.row.id,
      password,
      person: props.row.person,
    },
  })
  delLoad.close()
  if (response.data.status == 'ok') {
    sucfuc()
  } else {
    failfuc(response.data.reason, response.data.text)
  }
  refresh()
}
refresh()
</script>

<template>
  <div>
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
        <template #default>
          <el-card shadow="never">
            <el-table
              :data="data.deduction.filter((data: any) => !search || data.reason.toLowerCase().includes(search.toLowerCase()) || String(data.person).toLowerCase().includes(search.toLowerCase()) || String(data.deduction).toLowerCase().includes(search.toLowerCase()) || String(data.time).toLowerCase().includes(search.toLowerCase()))"
              max-height="480px"
              :row-class-name="tableRowClassName"
            >
              <el-table-column type="expand">
                <template #header>
                  <el-button type="text" :icon="Refresh" @click="refresh()"></el-button>
                </template>
                <template #default="props">
                  <deduction-description :data="props.row" />
                </template>
              </el-table-column>
              <!-- <el-table-column prop="id" label="扣分ID" /> -->
              <el-table-column prop="person" label="违纪者" />
              <el-table-column prop="deduction" label="扣分数" />
              <el-table-column prop="reason" label="原因" />
              <el-table-column prop="time" label="时间" />
              <el-table-column prop="deductor.name" label="扣分者" />
              <el-table-column align="right" fixed="right">
                <template #header>
                  <el-input v-model="search" size="mini" placeholder="输入以搜索" />
                </template>
                <template #default="props">
                  <el-button type="text" size="small" @click="deleteDeduction(props)"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>
