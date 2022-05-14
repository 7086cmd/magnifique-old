<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { Close, Minus, Plus, ArrowLeftBold } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { hideWindow, minWindow, maxWindow } from "../tauri";
const router = useRouter();
let isClient = ref(false);
try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true;
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

const closeServer = () => {
  isClient.value && window.magnifique.closeServer();
  hideWindow();
};
const minServerWindow = () => {
  isClient.value && window.magnifique.minServerWindow();
  minWindow();
};
const maxServerWindow = () => {
  isClient.value && window.magnifique.maxServerWindow();
  maxWindow();
};
const toHome = () => {
  router.push("/");
};
const isInTauri = ref("__TAURI_IPC__" in window || isClient.value);
</script>
<template>
  <div>
    <div style="text-align: right">
      <el-button
        style="text-align: right"
        :icon="ArrowLeftBold"
        type="primary"
        text
        @click="toHome()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Minus"
        type="warning"
        text
        @click="minServerWindow()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Plus"
        type="success"
        text
        @click="maxServerWindow()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Close"
        type="danger"
        text
        @click="closeServer()"
      >
      </el-button>
    </div>
  </div>
</template>
