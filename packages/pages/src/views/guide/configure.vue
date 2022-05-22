<!-- @format -->
<script setup lang="ts">
import { ref } from "vue";

const host = ref("");
</script>

<template>
  <div>
    <h3>配置您的 Magnifique 。</h3>
    <el-form>
      <el-form-item label="服务器地址">
        <el-input v-model="host"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
