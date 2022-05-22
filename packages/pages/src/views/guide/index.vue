<!-- @format -->
<script setup lang="ts">
import { ref } from "vue";
import ConfigPage from "./configure.vue";
import IntroductionPage from "./introduce.vue";
let open = ref(true);
let index = ref(1);
</script>

<template>
  <el-dialog v-model="open" title="欢迎使用 Magnifique ！" width="80%">
    <introduction-page v-if="index === 1" />
    <config-page v-if="index === 2" />
    <el-steps :active="index" simple>
      <el-step title="介绍"> </el-step>
      <el-step title="配置"> </el-step>
    </el-steps>
  </el-dialog>
</template>
