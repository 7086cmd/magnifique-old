<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { List, Box, HomeFilled } from "@element-plus/icons-vue";
import ControlsPage from "../../components/controls-page.vue";
import Controls from "../../components/controls-with-back.vue";

let pth = ref(new URL(location.href).pathname);
let heightClient = ref(window.innerHeight);
</script>
<template>
  <el-container>
    <el-aside width="15%">
      <el-menu :default-active="pth" router style="height: 100%">
        <controls-page :style="{ paddingBottom: '1em' }" type="admin" />
        <el-menu-item index="/admin/">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <template #title> 主页 </template>
        </el-menu-item>
        <el-sub-menu index="/admin/data/">
          <template #title>
            <el-icon>
              <List />
            </el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/admin/data/member">
              <template #title> 成员 </template>
            </el-menu-item>
            <el-menu-item index="/admin/data/volunteer">
              <template #title> 义工 </template>
            </el-menu-item>
            <el-menu-item index="/admin/data/deduction">
              <template #title> 扣分 </template>
            </el-menu-item>
            <el-menu-item index="/admin/data/post">
              <template #title> 投稿 </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/admin/message/">
          <el-icon>
            <Box />
          </el-icon>
          <template #title> 消息中心 </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right">
        <controls />
      </el-header>
      <el-main>
        <el-scrollbar :height="Math.floor((heightClient * 8) / 9)">
          <router-view> </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
