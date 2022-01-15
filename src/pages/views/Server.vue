<script lang="ts" setup>
import { Close, Minus, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { ref, Ref } from 'vue'
const router = useRouter()
const networks: Ref<string[]> = ref([])
try {
  if (window.magnifique.isElectron !== true) {
    networks.value = window.magnifique.networks
    ElMessageBox.alert('不是服务器', '错误', {
      center: true,
      type: 'warning',
    })
    router.push('/')
  }
} catch (_e) {
  ElMessageBox.alert('不是服务器', '错误', {
    center: true,
    type: 'warning',
  })
  router.push('/')
}
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
    <el-container>
      <el-header style="text-align: right">
        <el-button style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow"></el-button>
        <el-button style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow"></el-button>
        <el-button style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer"></el-button>
      </el-header>
      <el-container>
        <el-container>
          <el-main class="maint">
            服务器运行成功<br />Server running at <span v-for="i in networks" :key="i">{{ i }}<br /></span><br />
          </el-main>
          <el-footer>平台制作者：7086cmd</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less">
body {
  padding-top: 1em;
  font-size: 16px;
}
.maint {
  font-size: 28px;
}
</style>
