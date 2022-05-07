<script setup lang="ts">
/* global DeductionList */
import { defineProps, ref, toRefs, unref } from 'vue'

const props = defineProps<{
  data: DeductionList
}>()

const { data } = toRefs(props)

const detail = ref(unref(data) as DeductionList)
</script>
<template>
  <div>
    <el-descriptions :title="'扣分信息'" border>
      <el-descriptions-item label="违纪者">
        <member-dialog :number="detail.person" use-tag></member-dialog>
      </el-descriptions-item>
      <el-descriptions-item label="扣分数">
        {{ detail.deduction }}
      </el-descriptions-item>
      <el-descriptions-item label="原因">
        <el-tag v-text="detail.reason" />
      </el-descriptions-item>
      <el-descriptions-item label="地点">
        <el-tag v-text="detail.place" />
      </el-descriptions-item>
      <el-descriptions-item label="时间">
        {{ detail.time }}
      </el-descriptions-item>
      <el-descriptions-item label="扣分者">
        <member-dialog :number="detail.deductor.number" use-tag></member-dialog>
      </el-descriptions-item>
      <el-descriptions-item label="解释说明">
        {{ detail.description }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
