<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { Close, Minus, Plus, ArrowLeft } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { hideWindow, minWindow, maxWindow } from "../tauri";
import { Moon, Sunny } from "@element-plus/icons-vue";
import { useDark } from "@vueuse/core";
import { useToggle } from "@vueuse/shared";
const isDark = useDark();
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
  <div :style="{ textAlign: 'right' }">
    <el-switch
      v-model="isDark"
      inline-prompt
      :active-icon="Moon"
      active-color="#2c2c2c"
      :inactive-icon="Sunny"
      inactive-color="#f2f2f2"
      @change="useToggle(isDark)"
    />
    <el-divider direction="vertical"></el-divider>
    <span style="-webkit-app-region: drag">Magnifique</span>
    <el-divider direction="vertical"></el-divider>
    <el-button
      :icon="ArrowLeft"
      type="primary"
      text
      bg
      circle
      @click="toHome()"
    >
    </el-button>
    <el-button
      v-if="isInTauri"
      :icon="Minus"
      type="warning"
      text
      bg
      circle
      @click="minServerWindow()"
    >
    </el-button>
    <el-button
      v-if="isInTauri"
      :icon="Plus"
      type="success"
      text
      bg
      circle
      @click="maxServerWindow()"
    >
    </el-button>
    <el-button
      v-if="isInTauri"
      :icon="Close"
      type="danger"
      text
      bg
      circle
      @click="closeServer()"
    >
    </el-button>
  </div>
</template>
