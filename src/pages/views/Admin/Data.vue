<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, reactive } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElLoading } from 'element-plus'
import baseurl from '../../modules/baseurl'
import DeductionDescription from '../../components/lists/DeductionDescription.vue'
import sucfuc from '../../modules/sucfuc'
import failfuc from '../../modules/failfuc'

let isClient = ref(false)

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}
let exportTime = ref([])
let isExporting = ref(false)
let exportTypes = ref([
  {
    label: '班级单位',
    value: 'class',
  },
  {
    label: '扣分单位',
    value: 'detail',
  },
])
let isSubmiting = ref(false)
let exportType = ref('')

let data = reactive({
  deduction: [],
})
const { password } = JSON.parse(window.atob(String(localStorage.getItem('adminLoginInfo'))))
let nativeName = ref('')
let loading = ref(false)
let search = ref('')
const tableRowClassName = (props: any) => {
  const statuses = {
    processing: 'warning-row',
    failed: 'error-row',
    normal: '',
  }
  return statuses[props.row.status]
}
const refresh = async (content: string) => {
  loading.value = true
  data[content] = (
    await axios(`${baseurl}admin/get/all/${content}?password=${password}`, {
      method: 'get',
    })
  ).data.details
  for (let i = 0; i in data[content]; i++) {
    data[content][i].time = dayjs(data[content][i].time).format('YYYY/MM/DD')
  }
  loading.value = false
}
const deleteDeduction = async (props: any) => {
  const delLoad = ElLoading.service({
    text: '正在删除扣分，请稍后',
  })
  const response = await axios({
    url: `${baseurl}admin/del/deduction`,
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
  refresh('deduction')
}
const createData = async () => {
  isSubmiting.value = true
  const response = await axios(`${baseurl}admin/export/deduction/${exportType.value}/`, {
    data: {
      password,
      start: dayjs(exportTime.value[0]).toJSON(),
      end: dayjs(exportTime.value[1]).toJSON(),
    },
    method: 'post',
  })
  isSubmiting.value = false
  if (response.data.status == 'ok') {
    sucfuc()
    window.open(`${baseurl}admin/export/download/${response.data.details.token}`, isClient.value ? '_self' : '_blank')
  } else {
    failfuc(response.data.reason, response.data.text)
  }
}
</script>

<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-tabs v-model="nativeName" tab-position="left" style="padding-top: 10%">
        <el-tab-pane label="扣分数据" name="deduction">
          <el-card shadow="never">
            <template #header>
              <el-button type="text" @click="isExporting = true"> 导出 </el-button>
            </template>
            <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
              <template #default>
                <el-card shadow="never">
                  <el-table
                    :data="data.deduction.filter((data: any) => !search || data.reason.toLowerCase().includes(search.toLowerCase()) || String(data.person).toLowerCase().includes(search.toLowerCase()) || String(data.deduction).toLowerCase().includes(search.toLowerCase()) || String(data.time).toLowerCase().includes(search.toLowerCase()))"
                    highlight-current-row
                    max-height="480px"
                    :default-sort="{
                      prop: 'deduction',
                      order: 'descending',
                    }"
                    :row-class-name="tableRowClassName"
                  >
                    <el-table-column type="expand">
                      <template #header>
                        <el-button type="text" :icon="Refresh" @click="refresh('deduction')"></el-button>
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
        </el-tab-pane>
      </el-tabs>
      <el-dialog v-model="isExporting" title="导出数据">
        <el-form>
          <el-alert v-if="isClient" :closable="false" title="提醒" description="使用应用导出时是保存形式" type="info" icon="info" center></el-alert>
          <el-alert v-if="!isClient" :closable="false" title="提醒" description="使用浏览器导出时是下载形式" type="info" icon="info" center></el-alert>
          <el-form-item label="时间节点">
            <el-date-picker v-model="exportTime" type="datetimerange" style="width: 100%" range-separator="到" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          </el-form-item>
          <el-form-item label="导出类型">
            <el-select v-model="exportType" style="width: 100%">
              <el-option v-for="item in exportTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span className="dialog-footer">
            <el-button @click="isExporting = false"> 取消 </el-button>
            <el-button type="primary" :loading="isSubmiting" @click="createData"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </transition>
</template>
