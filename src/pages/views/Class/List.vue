<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable vue/html-indent */
import { ref, Ref, reactive } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import baseurl from '../../modules/baseurl'
import { Refresh } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
let loading = ref(true)
let nativeName = ref('deduction')
let data: {
  deduction: any[]
} = reactive({
  deduction: [],
})
let search = ref('')
let sumT = ref('')
const fbstatus = {
  normal: '未申诉',
  processing: '未处理',
  failed: '申诉失败',
}
const tableRowClassName = (props: any) => {
  const statuses = {
    processing: 'warning-row',
    failed: 'error-row',
    normal: '',
  }
  return statuses[props.row.status]
}
const refresh = () => {
  loading.value = true
  axios({
    url: `${baseurl}class/${gradeid}/${classid}/get/deduction?password=${password}`,
    method: 'get',
  }).then((response) => {
    if (response.data.status == 'ok') {
      loading.value = false
      data.deduction = response.data.details
      for (let i = 0; i in data.deduction; i++) {
        data.deduction[i].time = dayjs(data.deduction[i].time).format('YYYY/MM/DD HH:mm:ss')
        data.deduction[i].person = String(data.deduction[i].person % 100) + '号'
      }
      sumT.value = String(data.deduction.length)
    }
  })
}
refresh()
const callbackDeductions = (inf: any) => {
  ElMessageBox.prompt('确定要申诉吗？请输入原因。', '申诉', {
    center: true,
    type: 'warning',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    inputType: 'textarea',
  }).then((result) => {
    axios({
      url: `${baseurl}class/new/feedback`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        gradeid,
        classid,
        password: window.btoa(password),
        id: inf.id,
        msg: result.value,
      }),
      method: 'POST',
    }).then((response) => {
      if (response.data.status == 'ok') {
        ElMessageBox.alert('已发送申诉', '成功', {
          type: 'success',
          center: true,
        })
        refresh()
      } else {
        ElMessageBox.alert(
          t('dialogs.' + response.data.reason, {
            msg: response.data.text,
          }),
          '申诉失败',
          {
            type: 'error',
            center: true,
          }
        )
      }
    })
  })
}
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-tabs v-model="nativeName" tab-position="left" style="padding-top: 10%">
        <el-tab-pane label="扣分数据" name="deduction">
          <el-card shadow="never">
            <h4>扣分数据表格</h4>
            <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
              <template #default>
                <el-card shadow="never">
                  <el-table :data="data.deduction" highlight-current-row max-height="480px" show-summary :sum-text="sumT" :row-class-name="tableRowClassName">
                    <el-table-column type="expand">
                      <template #header>
                        <el-button type="text" :icon="Refresh" @click="refresh()"></el-button>
                      </template>
                      <template #default="props">
                        <el-descriptions :title="`扣分${props.row.id}信息`" border>
                          <el-descriptions-item label="违纪者">
                            {{ props.row.person }}
                          </el-descriptions-item>
                          <el-descriptions-item label="扣分数">
                            {{ props.row.deduction }}
                          </el-descriptions-item>
                          <el-descriptions-item label="原因">
                            {{ props.row.reason }}
                          </el-descriptions-item>
                          <el-descriptions-item label="地点">
                            {{ props.row.place }}
                          </el-descriptions-item>
                          <el-descriptions-item label="时间">
                            {{ props.row.time }}
                          </el-descriptions-item>
                          <el-descriptions-item label="扣分者">
                            {{ props.row.deductor.name }}
                          </el-descriptions-item>
                          <el-descriptions-item label="解释说明">
                            {{ props.row.description }}
                          </el-descriptions-item>
                          <el-descriptions-item label="申诉状态">
                            <el-popover placement="top-start" title="申诉状态" :width="200" trigger="hover">
                              <template #reference>
                                <el-button type="text"> 点击查看 </el-button>
                              </template>
                              {{ fbstatus[props.row.status] }}
                              <br />
                              <span v-if="props.row.status !== 'normal'"> 申诉原因：{{ props.row.msgs.feedback }} </span>
                              <br />
                              <span v-if="props.row.status === 'failed'"> 驳回原因：{{ props.row.msgs.turndown }} </span>
                            </el-popover>
                          </el-descriptions-item>
                        </el-descriptions>
                        <p style="font-size: 14px">
                          <span v-if="props.row.status !== 'normal'"> 申诉原因：{{ props.row.msgs.feedback }} </span>
                          <br />
                          <span v-if="props.row.status === 'failed'"> 驳回原因：{{ props.row.msgs.turndown }} </span>
                        </p>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="id" label="扣分ID" /> -->
                    <el-table-column prop="person" label="违纪者" />
                    <el-table-column prop="deduction" label="扣分数" />
                    <el-table-column prop="reason" label="原因" />
                    <!-- <el-table-column prop="place" label="地点" /> -->
                    <el-table-column prop="time" label="时间" />
                    <el-table-column align="right" fixed="right">
                      <template #header>
                        <el-input v-model="search" size="mini" placeholder="输入以搜索" />
                      </template>
                      <template #default="props">
                        <el-button type="text" size="small" :disabled="props.row.status == 'processing'" @click="callbackDeductions(props.row)"> 申诉 </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </template>
            </el-skeleton>
          </el-card>
        </el-tab-pane>
      </el-tabs>
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
