<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { Close, Minus, Plus } from "@element-plus/icons-vue";
import { hideWindow, minWindow, maxWindow } from "../tauri";

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
const isInTauri = ref("__TAURI_IPC__" in window || isClient.value);
</script>
<template>
  <div>
    <div style="text-align: right">
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Minus"
        type="warning"
        circle
        text
        @click="minServerWindow()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Plus"
        type="success"
        circle
        text
        @click="maxServerWindow()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Close"
        type="danger"
        circle
        text
        @click="closeServer()"
      >
      </el-button>
    </div>
  </div>
</template>
