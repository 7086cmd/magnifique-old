<script lang="ts" setup>
/* global VolunteerList */
import { ref, reactive } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import baseurl from '../../../modules/baseurl'
import volunteerExample from '../../../../examples/volunteer'
import VolunteerDescription from '../../../components/lists/VolunteerDescription.vue'

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
let volunteerData = reactive(volunteerExample())
volunteerData.status = 'planning'
volunteerData.person = number
let loading = ref(true)
let volunteerDetail = ref<VolunteerList[]>([])
const refresh = () => {
  loading.value = true
  axios(`${baseurl}member/${number}/volunteer/get?password=${password}`).then(response => {
    loading.value = false
    if (response.data.status == 'ok') {
      volunteerDetail.value = response.data.details as VolunteerList[]
    }
  })
}
refresh()
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
                  <el-tag v-if="['number', 'string'].includes(typeof props.row.person)" type="success" v-text="props.row.person" />
                  <el-tag v-for="item in props.row.person" v-else :key="item" type="success" v-text="item" />
                </template>
              </el-table-column>
              <el-table-column prop="project" label="义工项目" />
              <el-table-column label="义工时长">
                <template #default="props"> {{ props.row.duration }}小时 </template>
              </el-table-column>
              <el-table-column label="登记状态">
                <template #default="props">
                  <el-tag v-if="props.row.status === 'done'" type="success">已完成</el-tag>
                  <el-tag v-else-if="props.row.status === 'planning'" type="warning">计划中</el-tag>
                  <el-tag v-else type="error">已错过</el-tag>
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
.class-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
