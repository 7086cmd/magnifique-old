<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import baseurl from '../../modules/baseurl'

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
const name = ref('')
const score = ref(0)
let col = ref('success')
let actions = ref(0)
let violation = ref(0)
let department = ref('')
let whatdo = ref('')
let workflows = ref([])
let isFetchingWorkflows = ref(true)
const statuses = {
  planning: {
    color: 'primary',
    label: '计划中',
  },
  working: {
    color: 'warning',
    label: '实现中',
  },
  success: {
    color: 'success',
    label: '已完成',
  },
  depracted: {
    color: 'error',
    label: '已放弃',
  },
}

axios({
  url: `${baseurl}member/getinfo/${number}/`,
}).then((response) => {
  name.value = response.data.details.name
  let total = response.data.details.record.score
  actions.value = response.data.details.record.actions
  violation.value = response.data.details.record.violation
  department.value = response.data.details.in
  whatdo.value = response.data.details.do
  let itv = setInterval(() => {
    score.value++
    if (score.value >= 80) {
      col.value = 'success'
    } else if (score.value >= 60 && score.value < 80) {
      col.value = 'warning'
    } else if (score.value < 60) {
      col.value = 'exception'
    }
    if (score.value >= total) {
      clearInterval(itv)
    }
  }, 8)
})

axios({
  url: `${baseurl}member/${number}/workflow/get?password=${password}`,
}).then((response) => {
  workflows.value = response.data.details
  setTimeout(() => {
    isFetchingWorkflows.value = false
  }, 1200)
})

const tableRowClassName = ({ row }) => {
  return statuses[row.status].color + '-row'
}
</script>
<template>
  <div>
    <h3>仪表盘</h3>
    <el-divider>{{ whatdo }} {{ name }}</el-divider>
    <el-row :gutter="8">
      <el-col :span="10">
        <el-card class="box-card" shadow="never">
          <el-progress type="dashboard" :percentage="score" :status="col">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}</span>
              <span class="percentage-label">素质分</span>
            </template>
          </el-progress>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card" shadow="never">
          <span class="percentage-value-2">{{ actions }}</span>
          <span class="percentage-label-2">操作</span>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card" shadow="never">
          <template #default>
            <span class="percentage-value-2">{{ violation }}</span>
            <span class="percentage-label-2">违纪</span>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-divider>{{ whatdo }} {{ name }}</el-divider>
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>工作流</span>
        </div>
      </template>
      <el-skeleton animated :rows="4" :loading="isFetchingWorkflows">
        <template #default>
          <el-table
            :data="workflows"
            max-height="240px"
            :default-sort="{
              prop: 'importance',
              order: 'descending',
            }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="description" label="解释" />
            <el-table-column prop="deadline" label="截止日期" />
          </el-table>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<style>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.percentage-value-2 {
  display: block;
  margin-top: 10px;
  font-size: 56px;
}
.percentage-label-2 {
  display: block;
  margin-top: 12px;
  font-size: 18px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-lighter);
}
.el-table .error-row {
  --el-table-tr-bg-color: var(--el-color-error-lighter);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-lighter);
}
.el-table .primary-row {
  --el-table-tr-bg-color: var(--el-color-primary-lighter);
}
</style>
