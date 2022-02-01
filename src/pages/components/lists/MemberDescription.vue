<script setup lang="ts">
/* global member_processed */
import { defineProps, ref, toRefs, unref } from 'vue'

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  data: Object,
})

const { data } = toRefs(props)

const detail = ref(unref(data) as member_processed)
</script>

<template>
  <div>
    <el-descriptions :title="'成员' + detail.number + '信息'" border>
      <el-descriptions-item label="姓名">
        {{ detail.name }}
      </el-descriptions-item>
      <el-descriptions-item label="学号">
        {{ detail.number }}
      </el-descriptions-item>
      <el-descriptions-item label="所属部门">
        <el-tag type="info">{{ detail.in }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="职务">
        <el-tag v-for="item in detail.duty" :key="item" size="default" v-text="item" />
      </el-descriptions-item>
      <el-descriptions-item label="管理">
        <el-tag v-for="item in detail.admin" :key="item" size="default" v-text="item" />
      </el-descriptions-item>
      <el-descriptions-item label="责任">
        <span v-if="detail.icg">
          <el-tag type="warning">主席团成员</el-tag>
          做好带头作用，团结互助
        </span>
        <span v-if="!detail.icg">
          <el-tag type="success">非主席团成员</el-tag>
          积极响应，发展个人
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="素质分">
        {{ detail.record.score }}
      </el-descriptions-item>
      <el-descriptions-item label="违纪次数">
        {{ detail.record.violation }}
      </el-descriptions-item>
      <el-descriptions-item label="反馈次数">
        {{ detail.record.actions }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
