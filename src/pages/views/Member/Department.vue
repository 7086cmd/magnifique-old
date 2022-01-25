<script setup lang="ts">
import { ref } from 'vue'
import deduction from './departments/deduction.vue'
const choice = ref('')
</script>

<template>
  <div>
    <h3>部门</h3>
    <el-tabs v-model="choice" tab-position="left">
      <el-tab-pane label="扣分" name="deduction">
        <deduction />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
