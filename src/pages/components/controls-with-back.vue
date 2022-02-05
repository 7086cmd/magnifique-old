<script lang="ts" setup>
import { ref } from 'vue'
import { Close, Minus, Plus, ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
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
const toHome = () => {
  router.push('/')
}
</script>
<template>
  <div>
    <div style="text-align: right">
      <el-button v-if="isClient" style="text-align: right" :icon="ArrowLeftBold" color="#626aef" circle plain size="small" @click="toHome()"> </el-button>
      <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()"> </el-button>
      <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()"> </el-button>
      <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()"> </el-button>
    </div>
  </div>
</template>
