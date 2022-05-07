<script setup lang="ts">
/* global member_processed */
import { defineProps, ref, toRefs, unref } from 'vue'

const props = defineProps<{ data: member_processed }>()

const { data } = toRefs(props)

const detail = ref(unref(data) as member_processed)
</script>

<template>
  <div>
    <el-descriptions border direction="vertical">
      <el-descriptions-item label="姓名">
        <member-dialog :number="detail.number"></member-dialog>
      </el-descriptions-item>
      <el-descriptions-item label="学号">
        <span v-text="detail.number"></span>
      </el-descriptions-item>
      <el-descriptions-item label="所属部门">
        <el-tag type="info" v-text="detail.in"></el-tag>
        <el-tag type="info" v-text="detail.do"></el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="职权">
        <el-tag type="warning" size="default" v-text="'工作'"></el-tag>
        <el-tag v-for="item in detail.duty" :key="item" size="default" v-text="item" />
        <el-tag v-if="detail.admin.length !== 0" type="warning" size="default" v-text="'管理'"></el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="管理">
        <el-tag type="success" size="default" v-text="'自我管理'"></el-tag>
        <el-tag v-for="item in detail.admin" :key="item" size="default" v-text="item" />
      </el-descriptions-item>
      <el-descriptions-item label="责任">
        <span v-if="detail.icg">
          <el-tag type="warning">骨干成员</el-tag>
          做好带头作用，团结互助
        </span>
        <span v-if="!detail.icg">
          <el-tag type="success">成员</el-tag>
          积极响应，发展个人
        </span>
        <br />
        <span>
          <el-tag type="error">学生</el-tag>
          认真学习
        </span>
        <br />
        <span>
          <el-tag style="--el-tag-text-color: #626aef; --el-tag-bg-color: rgb(239, 240, 253)">社会成员</el-tag>
          积极参加义工等社会实践，服务于社会
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
