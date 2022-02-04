<script lang="ts" setup>
/* global PostList */
import { ref, Ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import baseurl from '../../../modules/baseurl'
import postDescription from '../../../components/lists/postDescription.vue'
import dayjs from 'dayjs'

const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))

let isFetchingData = ref(false)
let allData: Ref<PostList[]> = ref([])
const refresh = async () => {
  isFetchingData.value = true
  const response = await axios(`${baseurl}class/${gradeid}/${classid}/get/post`, {
    params: {
      password,
    },
  })
  isFetchingData.value = false
  if (response.data.status == 'ok') {
    allData.value = response.data.details as PostList[]
    allData.value.map((item: PostList) => {
      item.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
      return item
    })
  }
}
refresh()
</script>

<template>
  <div>
    <el-skeleton :loading="isFetchingData" :rows="4" animated :throttle="500">
      <template #default>
        <el-card shadow="never">
          <el-table :data="allData" max-height="640px">
            <el-table-column type="expand">
              <template #header>
                <el-button type="text" :icon="Refresh" @click="refresh()"></el-button>
              </template>
              <template #default="props">
                <post-description :data="props.row" />
              </template>
            </el-table-column>
            <el-table-column prop="person" label="上传者" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="type" label="体裁" />
            <el-table-column prop="time" label="时间" />
          </el-table>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>
