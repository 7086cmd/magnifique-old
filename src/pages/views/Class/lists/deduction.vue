<script lang="ts" setup>
/* global DeductionList */
import { ref, reactive } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import baseurl from '../../../modules/baseurl'
import { Refresh } from '@element-plus/icons-vue'
import failfuc from '../../../modules/failfuc'
import sucfuc from '../../../modules/sucfuc'
import DeductionDescription from '../../../components/lists/DeductionDescription.vue'
const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
let loading = ref(true)
let data: {
  deduction: DeductionList[]
} = reactive({
  deduction: [],
})
let sumT = ref('')
const tableRowClassName = (props: { row: DeductionList }) => {
  const statuses = {
    processing: 'warning-row',
    failed: 'error-row',
    normal: '',
  }
  return statuses[props.row.status]
}
const refresh = () => {
  loading.value = true
  axios(`${baseurl}class/${gradeid}/${classid}/get/deduction?password=${password}`).then((response) => {
    if (response.data.status == 'ok') {
      loading.value = false
      data.deduction = response.data.details
      data.deduction.map((item: DeductionList) => {
        item.time = dayjs(item.time).format('YYYY/MM/DD HH:mm:ss')
      })
      sumT.value = String(data.deduction.length)
    }
  })
}
refresh()
const callbackDeductions = (inf: DeductionList) => {
  ElMessageBox.prompt('确定要申诉吗？请输入原因。', '申诉', {
    center: true,
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    inputType: 'textarea',
  }).then((result) => {
    axios(`${baseurl}class/new/feedback`, {
      data: {
        gradeid,
        classid,
        password: window.btoa(password),
        id: inf.id,
        msg: result.value,
      },
      method: 'POST',
    }).then((response) => {
      if (response.data.status == 'ok') {
        sucfuc()
        refresh()
      } else {
        failfuc(response.data.reason, response.data.text)
      }
    })
  })
}
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
        <template #default>
          <el-card shadow="never">
            <el-table :data="data.deduction" max-height="480px" show-summary :sum-text="sumT" :row-class-name="tableRowClassName">
              <el-table-column type="expand">
                <template #header>
                  <el-button type="text" :icon="Refresh" @click="refresh()"></el-button>
                </template>
                <template #default="props">
                  <deduction-description :data="props.row" />
                </template>
              </el-table-column>
              <el-table-column prop="person" label="违纪者" />
              <el-table-column prop="deduction" label="扣分数" />
              <el-table-column prop="reason" label="原因" />
              <el-table-column prop="time" label="时间" />
              <el-table-column align="right" fixed="right">
                <template #default="props">
                  <el-button type="text" size="small" :disabled="props.row.status == 'processing'" @click="callbackDeductions(props.row)"> 申诉 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </template>
      </el-skeleton>
    </div>
  </transition>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-lighter);
}
.el-table .error-row {
  --el-table-tr-bg-color: var(--el-color-error-lighter);
}
</style>
