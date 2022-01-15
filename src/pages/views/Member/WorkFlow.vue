<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, reactive, Ref } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessageBox, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import baseurl from '../../modules/baseurl'

const { t } = useI18n()

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
let formRef = ref(null)
let isSubmitingNewWorkFlow = ref(false)
let newWorkFlow = ref(false)
let workflows: Ref<any[]> = ref([])
let isFetchingWorkflows = ref(true)
let workflowInformation = reactive({
  title: '',
  description: '',
  deadline: '',
  importance: 0,
  password,
})
let isActing = ref(false)
const rules = {
  title: [
    {
      required: true,
      message: '输入标题',
      trigger: 'blur',
    },
    {
      min: 5,
      max: 20,
      message: '标题字数必须在5-20个字之间',
      trigger: 'blur',
    },
  ],
  deadline: [
    {
      type: 'date',
      required: true,
      message: '请选择截止日期',
      trigger: 'change',
    },
  ],
}
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

const tableRowClassName = ({ row }) => {
  return statuses[row.statusCode].color + '-row'
}

const refresh = () => {
  isFetchingWorkflows.value = true
  axios({
    url: `${baseurl}member/${number}/workflow/get?password=${password}`,
  }).then((response) => {
    workflows.value = response.data.details
    for (let i = 0; i in workflows.value; i++) {
      workflows.value[i].deadline = dayjs(workflows.value[i].deadline).format('YYYY/MM/DD HH:mm:ss')
      workflows.value[i].start = dayjs(workflows.value[i].start).format('YYYY/MM/DD HH:mm:ss')
      workflows.value[i].statusCode = workflows.value[i].status
      workflows.value[i].status = statuses[workflows.value[i].status].label
    }
    isFetchingWorkflows.value = false
  })
}

refresh()

const newWorkFlowAction = async () => {
  if (workflowInformation.deadline == '') {
    ElMessageBox.alert('没有输入截至日期', '新建工作失败', {
      type: 'error',
      center: true,
    })
    return
  }
  if (workflowInformation.title == '') {
    ElMessageBox.alert('没有输入标题', '新建工作失败', {
      type: 'error',
      center: true,
    })
    return
  }
  if (workflowInformation.title.split('').length >= 20 || workflowInformation.title.split('').length <= 5) {
    ElMessageBox.alert(`标题字数不合格，要求5-20个字，您输入了${workflowInformation.title.split('').length}个字`, '新建工作失败', {
      type: 'error',
      center: true,
    })
    return
  }
  isSubmitingNewWorkFlow.value = true
  const response = await axios(`${baseurl}member/${number}/workflow/new`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: workflowInformation,
    method: 'post',
  })
  isSubmitingNewWorkFlow.value = false
  if (response.data.status == 'ok') {
    ElMessageBox.alert('创建工作成功', '成功', {
      type: 'success',
      center: true,
    })
  } else {
    ElMessageBox.alert(
      t('dialogs.' + response.data.reason, {
        msg: response.data.text,
      }),
      '失败',
      {
        type: 'error',
        center: true,
      }
    )
  }
  newWorkFlow.value = false
  refresh()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusAction = async (props: any, action: string) => {
  // isActing.value = true
  const loadingStatus = ElLoading.service({
    fullscreen: true,
    text: '正在操作中...',
  })
  const response = await axios(`${baseurl}member/${number}/workflow/${action}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: props.row.id,
      password,
    },
  })
  loadingStatus.close()
  if (response.data.status == 'ok') {
    ElMessageBox.alert('操作成功', '成功', {
      type: 'success',
      center: true,
    })
  } else {
    ElMessageBox.alert(
      t('dialogs.' + response.data.reason, {
        msg: response.data.text,
      }),
      '失败',
      {
        type: 'error',
        center: true,
      }
    )
  }
  refresh()
}
</script>
<template>
  <div>
    <h3>工作流</h3>
    <el-skeleton :loading="isFetchingWorkflows" :rows="4" animated :throttle="500">
      <template #default>
        <el-card shadow="never">
          <el-table :data="workflows" max-height="640px" highlight-current-row :row-class-name="tableRowClassName" style="width: 100%; height: 100%">
            <el-table-column type="expand">
              <template #header><el-button type="text" :icon="Refresh" @click="refresh()"></el-button></template>
              <template #default="props">
                <el-alert title="提醒：这不是Bug哦，这个真的是工作流的编号" type="info" center></el-alert>
                <el-descriptions :title="'工作流' + props.row.id + '信息'" border>
                  <el-descriptions-item label="标题">{{ props.row.title }}</el-descriptions-item>
                  <el-descriptions-item label="说明">{{ props.row.description }}</el-descriptions-item>
                  <el-descriptions-item label="截止日期">{{ props.row.deadline }}</el-descriptions-item>
                  <el-descriptions-item label="状态">{{ props.row.status }}</el-descriptions-item>
                  <el-descriptions-item label="开始日期">{{ props.row.start }}</el-descriptions-item>
                </el-descriptions>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column><el-table-column prop="deadline" label="截止日期"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column align="right">
              <template #header><el-button type="text" @click="newWorkFlow = true">新建工作</el-button></template>
              <template #default="props">
                <el-button type="text" :disabled="props.row.statusCode !== 'planning'" @click="statusAction(props, 'start')">开始</el-button>
                <el-button type="text" :disabled="props.row.statusCode !== 'working'" @click="statusAction(props, 'pause')">放下</el-button>
                <el-button type="text" :disabled="props.row.statusCode !== 'working'" @click="statusAction(props, 'finish')">成功</el-button>
                <el-button type="text" :disabled="props.row.statusCode !== 'working'" @click="statusAction(props, 'quit')">放弃</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </template>
    </el-skeleton>
    <el-dialog ref="formRef" v-model="newWorkFlow" v-loading="isActing" title="新建工作" destroy-on-close center width="60%" :rules="rules">
      <el-form :model="workflowInformation">
        <el-form-item label="工作标题"><el-input v-model="workflowInformation.title"></el-input></el-form-item>
        <el-form-item label="工作细则"><el-input v-model="workflowInformation.description" type="textarea" :autosize="{ minRows: 6, maxRows: 10 }"></el-input></el-form-item>
        <el-form-item label="截止日期"><el-date-picker v-model="workflowInformation.deadline" type="datetime" style="width: 100%"></el-date-picker></el-form-item>
        <el-form-item label="重要性"><el-input-number v-model="workflowInformation.importance" :min="1" :max="10" style="width: 100%"></el-input-number></el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newWorkFlow = false">取消</el-button><el-button type="primary" :loading="isSubmitingNewWorkFlow" @click="newWorkFlowAction">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
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
