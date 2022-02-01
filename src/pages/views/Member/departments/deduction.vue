<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
/* global member */
import { ref, reactive, watch, Ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElMessageBox, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import baseurl from '../../../modules/baseurl'
import example from '../../../../examples/deduction'
import failfuc from '../../../modules/failfuc'
import sucfuc from '../../../modules/sucfuc'
import arrayToObject from '../../../../modules/utils/array-to-object'
import DeductionDescription from '../../../components/lists/DeductionDescription.vue'

const { t } = useI18n()

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))

let deductionData = reactive(example())
let typs = ref<string[]>([])
let typicals = ref<string[]>([])
let dets = ref<
  Record<
    string,
    {
      deduction: number
    }
  >
>({})
;(async () => {
  let data1 = (await axios(`${baseurl}member/getinfo/${number}/raw`)).data.details as member
  deductionData.deductor.name = data1.name
  deductionData.deductor.number = parseInt(number)
  const result = (await axios(`${baseurl}department/`)).data
  const typesOfDeduction = result.details.departments[data1.union.department].classes as {
    reason: string
    deduction: number
  }[]
  typicals.value = typesOfDeduction.map((item) => item.reason) as string[]
  dets.value = arrayToObject('reason', typesOfDeduction) as Record<
    string,
    {
      deduction: number
    }
  >
})()
watch(typs, () => {
  let dtotal = 0
  for (let i = 0; i in typs.value; i++) {
    dtotal = Math.floor((dtotal + dets.value[typs.value[i]].deduction) * 100) / 100
  }
  deductionData.deduction = dtotal
})
let isFetchingData = ref(false)
let newDeduction = ref(false)
let isCreating = ref(false)
let allData: Ref<any[]> = ref([])
const fbstatus = {
  normal: '未申诉',
  processing: '未处理',
  failed: '申诉失败',
}
const tableRowClassName = (scope: any) => {
  const statuses = {
    processing: 'warning-row',
    failed: 'success-row',
    normal: '',
  }
  return statuses[scope.row.status]
}
const refresh = async () => {
  isFetchingData.value = true
  const response = await axios(`${baseurl}member/deduction/${number}/work/get/deduction`, {
    params: {
      password,
    },
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
const turnDown = async (props: any) => {
  ElMessageBox.prompt('驳回原因', '驳回', {
    type: 'warning',
    center: true,
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    inputType: 'textarea',
  }).then(async (result) => {
    const delLoad = ElLoading.service({
      text: '正在驳回，请稍后',
    })
    const response = await axios(`${baseurl}member/deduction/${number}/work/turnd/deduction`, {
      data: {
        id: props.row.id,
        password,
        person: props.row.personnum,
        reason: result.value,
      },
      method: 'post',
    })
    delLoad.close()
    if (response.data.status == 'ok') {
      sucfuc()
    } else {
      failfuc(response.data.reason, response.data.text)
    }
    refresh()
  })
}
const deleteDeduction = async (props: any) => {
  const delLoad = ElLoading.service({
    text: '正在删除扣分，请稍后',
  })
  const response = await axios(`${baseurl}member/deduction/${number}/work/del/deduction`, {
    data: {
      id: props.row.id,
      password,
      person: props.row.personnum,
    },
    method: 'post',
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
const submitDeduction = async () => {
  let allSuccess = true
  let msgs: string[] = []
  const ded = async () => {
    if (deductionData.person >= 21000000 || deductionData.person <= 10000000) {
      failfuc('学号错误', '')
    } else if (typs.value.length == 0) {
      failfuc('类型错误', '')
    } else if (deductionData.place == '') {
      failfuc('地点错误', '')
    } else if (!dayjs(deductionData.time).isValid()) {
      failfuc('日期错误', '')
    } else {
      isCreating.value = true
      for (let i = 0; i in typs.value; i++) {
        let data = deductionData
        data.reason = typs.value[i]
        data.deduction = dets.value[typs.value[i]].deduction
        const response = await axios(`${baseurl}member/deduction/${number}/work/new/deduction`, {
          data: {
            id: number,
            password,
            content: data,
          },
          method: 'post',
        })
        isCreating.value = false
        if (response.data.status !== 'ok') {
          allSuccess = false
          msgs.push(
            t('dialogs.' + response.data.reason, {
              msg: response.data.text,
            })
          )
        }
      }
      if (allSuccess) {
        ElMessageBox.alert('操作成功', '成功', {
          type: 'success',
          center: true,
        })
      } else {
        ElMessageBox.alert(Array.from(new Set(msgs)).join('<br>'), '失败', {
          type: 'error',
          center: true,
          dangerouslyUseHTMLString: true,
        })
      }
      deductionData.person = 0
      deductionData.reason = ''
      deductionData.description = ''
      deductionData.deduction = 0
      deductionData.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
      deductionData.place = ''
      typs.value = []
      refresh()
    }
  }
  if (deductionData.deduction <= 0.3) {
    ded()
  } else {
    ElMessageBox.confirm('扣分数大于0.3分，确定吗', '小心', {
      type: 'warning',
      center: true,
      confirmButtonText: '是的',
      cancelButtonText: '算了',
    })
      .then(() => {
        ded()
      })
      .catch(() => {
        deductionData.person = 0
        deductionData.reason = ''
        deductionData.description = ''
        deductionData.deduction = 0
        deductionData.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
        deductionData.place = ''
        typs.value = []
        refresh()
      })
  }
}
</script>

<template>
  <div>
    <el-skeleton :loading="isFetchingData" :rows="4" animated :throttle="500">
      <template #default>
        <el-card shadow="never">
          <el-table :data="allData" max-height="640px" highlight-current-row :row-class-name="tableRowClassName">
            <el-table-column type="expand">
              <template #header>
                <el-button type="text" :icon="Refresh" @click="refresh()"></el-button>
              </template>
              <template #default="props">
                <deduction-description :data="props.row" />
              </template>
            </el-table-column>
            <el-table-column prop="personnum" label="违纪者" />
            <el-table-column prop="deduction" label="扣分数" />
            <el-table-column prop="reason" label="原因" />
            <el-table-column prop="time" label="时间" />
            <el-table-column align="right" fixed="right">
              <template #header>
                <el-button type="text" @click="newDeduction = true"> 新建扣分 </el-button>
              </template>
              <template #default="props">
                <el-button type="text" size="small" :disabled="props.row.status !== 'processing'" @click="turnDown(props)"> 驳回 </el-button>
                <el-popconfirm title="确定删除？" @confirm="deleteDeduction(props)">
                  <template #reference>
                    <el-button type="text" size="small" :disabled="props.row.status === 'failed'"> 删除 </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </template>
    </el-skeleton>
    <el-dialog v-model="newDeduction" title="新建扣分" center width="60%">
      <el-form :model="deductionData" label-position="right">
        <el-form-item label="时间">
          <el-date-picker v-model="deductionData.time" type="datetime" style="width: 100%" />
        </el-form-item>
        <el-form-item label="违纪者">
          <el-input v-model="deductionData.person" />
        </el-form-item>
        <el-form-item label="扣分原因">
          <el-select v-model="typs" style="width: 100%" multiple>
            <el-option v-for="i in typicals" :key="i" :label="i" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扣分数">
          <el-input v-model="deductionData.deduction" readonly></el-input>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="deductionData.place"></el-input>
        </el-form-item>
        <el-form-item label="解释说明">
          <el-input v-model="deductionData.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="newDeduction = false"> 取消 </el-button>
          <el-button type="primary" :loading="isCreating" @click="submitDeduction"> 确定 </el-button>
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
</style>
