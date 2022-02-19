<script lang="ts" setup>
import { ref } from 'vue'
import { Close, Minus, Plus } from '@element-plus/icons-vue'

let isClient = ref(false)
try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

const closeServer = () => {
  window.magnifique.closeServer()
}
const minServerWindow = () => {
  window.magnifique.minServerWindow()
}
const maxServerWindow = () => {
  window.magnifique.maxServerWindow()
}
</script>
<template>
  <div>
    <div style="text-align: right">
      <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()"> </el-button>
      <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()"> </el-button>
      <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()"> </el-button>
    </div>
  </div>
</template>
