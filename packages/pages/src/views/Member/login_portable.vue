<!-- @format -->

<script setup lang="ts">
import LoginMember from "./Login.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
      <h4>{{ t("login.title") }}</h4>
      <login-member
        :number-def="route.params.id"
        :redr="route.query.redirection"
      />
    </el-drawer>
  </div>
</template>
