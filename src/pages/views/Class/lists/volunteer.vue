<script lang="ts" setup>
/* global VolunteerQueryResult, member_processed */
import { ref, reactive } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import baseurl from '../../../modules/baseurl'
import volunteerExample from '../../../../examples/volunteer'
import failfuc from '../../../modules/failfuc'
import sucfuc from '../../../modules/sucfuc'
import VolunteerDescription from '../../../components/lists/VolunteerDescription.vue'
import createYearTransformer from '../../../../modules/utils/transform-date'
import dayjs from 'dayjs'

const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
let basicnum = ref(0)
;(async () => {
  basicnum.value = createYearTransformer(gradeid) * 100 + classid
})()
let isSubmiting = ref(false)
let isRegistingVolunteer = ref(false)
let volunteerData = reactive(volunteerExample())
volunteerData.status = 'planning'
let persons = ref<member_processed[]>([])
axios(`${baseurl}class/${gradeid}/${classid}/member/get?password=${password}`).then((response) => {
  persons.value.push(...response.data.details)
})
let loading = ref(true)
let volunteerDetail = ref([])
const refresh = () => {
  loading.value = true
  axios(`${baseurl}class/${gradeid}/${classid}/get/volunteer?password=${password}`).then((response) => {
    loading.value = false
    if (response.data.status == 'ok') {
      volunteerDetail.value = response.data.details as VolunteerQueryResult[]
    }
  })
}
refresh()
const createRegistry = async () => {
  if (volunteerData.person.length == 0) {
    failfuc('没有登记人员', '')
  } else if (volunteerData.project === '') {
    failfuc('没有输入义工项目名称', '')
  } else if (volunteerData.place == '') {
    failfuc('没有输入地点', '')
  } else if (!dayjs(volunteerData.time).isValid()) {
    failfuc('时间输入不正确', '')
  } else {
    isSubmiting.value = true
    const response = await axios(`${baseurl}class/create/volunteer`, {
      data: {
        volunteer: volunteerData,
        password,
        gradeid,
        classid,
      },
      method: 'post',
    })
    isSubmiting.value = false
    if (response.data.status == 'ok') {
      sucfuc()
    } else {
      failfuc(response.data.reason, response.data.text)
    }
  }
}
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
        <template #default>
          <el-card shadow="never">
            <el-table :data="volunteerDetail" highlight-current-row max-height="480px">
              <el-table-column type="expand">
                <template #header>
                  <el-button type="text" :icon="Refresh" @click="refresh()" />
                </template>
                <template #default="props">
                  <volunteer-description :data="props.row" />
                </template>
              </el-table-column>
              <el-table-column label="参与者">
                <template #default="props">
                  <el-tag v-if="typeof props.row.person === 'number'" type="success" v-text="props.row.person" />
                  <el-tag v-for="item in props.row.person" v-else :key="item" type="success" v-text="item" />
                </template>
              </el-table-column>
              <el-table-column prop="project" label="义工项目" />
              <el-table-column label="义工时长">
                <template #default="props"> {{ props.row.duration }}小时 </template>
              </el-table-column>
            </el-table>
          </el-card>
        </template>
      </el-skeleton>
      <el-dialog v-model="isRegistingVolunteer" title="义工登记" center>
        <template #header>义工登记</template>
        <el-form v-model="volunteerData" title="义工登记">
          <el-form-item label="义工时间">
            <el-date-picker v-model="volunteerData.time" type="datetime" style="width: 100%" />
          </el-form-item>
          <el-form-item label="义工人员">
            <el-select v-model="volunteerData.person" style="width: 100%" multiple>
              <el-option v-for="item in persons" :key="item.number" :label="item.name" :value="item.number">
                <span style="float: left" v-text="item.name"></span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{ item.volunteer }}小时义工时间</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="义工项目">
            <el-input v-model="volunteerData.project"></el-input>
          </el-form-item>
          <el-form-item label="义工地点">
            <el-input v-model="volunteerData.place" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
          </el-form-item>
          <el-form-item label="义工时长">
            <el-slider v-model="volunteerData.duration" :step="0.5" :min="0" :max="3"></el-slider>
            <!-- 一次登记不得超过3小时 -->
            <el-input-number v-model="volunteerData.duration" style="width: 100%" :step="0.5" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="isRegistingVolunteer = false"> 取消 </el-button>
            <el-button color="#626aef" style="color: white" :loading="isSubmiting" @click="createRegistry"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
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
.class-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
