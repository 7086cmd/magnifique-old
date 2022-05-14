<!-- @format -->

<script setup lang="ts">
import LoginMember from "./Login.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const isOpenWindow = ref(false);

onMounted(() => (isOpenWindow.value = true));

const route = useRoute();
</script>

<template>
  <div style="text-align: center">
    <el-drawer
      v-model="isOpenWindow"
      direction="rtl"
      size="60%"
      :modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <h4>请先登录</h4>
      <login-member
        :number-def="route.params.id"
        :redr="route.query.redirection"
      />
    </el-drawer>
  </div>
</template>
