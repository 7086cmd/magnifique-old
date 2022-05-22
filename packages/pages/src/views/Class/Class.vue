<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { HomeFilled as Home, List, Box } from "@element-plus/icons-vue";
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
    <el-container>
      <el-aside width="15%">
        <el-menu :default-active="pth" router style="height: 100%">
          <controls-page
            :style="{ paddingBottom: '1em', paddingTop: '0' }"
            type="class"
            :gradeid="gradeid"
            :classid="classid"
          />
          <el-menu-item index="/class/">
            <el-icon>
              <Home />
            </el-icon>
            <template #title>主页</template>
          </el-menu-item>
          <el-sub-menu index="/class/list/">
            <template #title>
              <el-icon>
                <List />
              </el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/class/list/member">
                <template #title> 成员 </template>
              </el-menu-item>
              <el-menu-item index="/class/list/volunteer">
                <template #title> 义工 </template>
              </el-menu-item>
              <el-menu-item index="/class/list/deduction">
                <template #title> 扣分 </template>
              </el-menu-item>
              <el-menu-item index="/class/list/post">
                <template #title> 投稿 </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="/class/message/">
            <el-icon>
              <Box />
            </el-icon>
            <template #title>消息</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <controls-with-back :style="{ textAlign: 'right' }" />
        </el-header>
        <el-main>
          <el-scrollbar :height="Math.floor((heightClient * 8) / 9)">
            <router-view> </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
