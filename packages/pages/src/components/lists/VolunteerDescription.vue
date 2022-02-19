<script setup lang="ts">
/* global VolunteerCombo */
import { defineProps, ref, toRefs, unref } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  data: VolunteerCombo
}>()

const { data } = toRefs(props)

const detail = ref(unref(data) as VolunteerCombo)
</script>
<template>
  <div>
    <el-descriptions :title="'义工信息'" border>
      <el-descriptions-item label="义工参与者">
        <el-tag v-if="['number', 'string'].includes(typeof detail.person)" type="success" v-text="detail.person" />
        <el-tag v-for="item in detail.person" v-else :key="item" type="success" v-text="item" />
      </el-descriptions-item>
      <el-descriptions-item label="义工时长">
        <el-tag type="" v-text="detail.duration + '小时'" />
      </el-descriptions-item>
      <el-descriptions-item label="义工项目">
        <el-tag v-text="detail.project" />
      </el-descriptions-item>
      <el-descriptions-item label="义工地点">
        {{ detail.place }}
      </el-descriptions-item>
      <el-descriptions-item label="时间">
        {{ dayjs(detail.time).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="义工登记状态">
        <el-tag v-if="detail.status === 'done'" type="success">已完成</el-tag>
        <el-tag v-else-if="detail.status === 'planning'" type="warning">计划中</el-tag>
        <el-tag v-else type="error">已错过</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    义工编号：<el-tag type="info">{{ detail.idInUserData }}</el-tag> <br />义工登记编号：<el-tag type="info">{{ detail.createId }}</el-tag>
  </div>
</template>
