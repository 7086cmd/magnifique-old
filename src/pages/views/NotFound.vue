<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <el-container>
    <el-aside width="5%" />
    <el-main>
      <h2>404 Page Not Found...</h2>
      <el-button @click="router.push('/')">回到主页</el-button>
    </el-main>
    <el-aside width="5%" />
  </el-container>
</template>
