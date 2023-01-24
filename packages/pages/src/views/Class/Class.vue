<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { HomeFilled as Home } from "@element-plus/icons-vue";
import ControlsPage from "../../components/controls-page.vue";
import ControlsWithBack from "../../components/controls-with-back.vue";

let heightClient = ref(window.innerHeight);

const { gradeid, classid } = JSON.parse(
  window.atob(String(localStorage.getItem("classLoginInfo")))
);

let pth = ref(new URL(location.href).pathname);
</script>
<template>
  <el-container>
    <el-aside width="16%">
      <controls-with-back
        :style="{ textAlign: 'right', paddingBottom: '1%' }"
      />
      <controls-page
        :style="{
          textAlign: 'center',
          paddingTop: '3%',
          border: 'true',
          borderRadius: '5px',
        }"
        type="class"
        :gradeid="gradeid"
        :classid="classid"
      />
    </el-aside>
    <el-main>
      <el-scrollbar :height="Math.floor((heightClient * 8) / 9)">
        <router-view> </router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
