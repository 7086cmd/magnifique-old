<!-- @format -->

<script lang="ts" setup>
/* global member */
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import baseurl from "../../modules/baseurl";
import { List, Box, Odometer, Magnet } from "@element-plus/icons-vue";
import ControlsWithBack from "../../components/controls-with-back.vue";
import ControlsPage from "../../components/controls-page.vue";
import personExample from "../../../examples/person";

let heightClient = ref(window.innerHeight);

const router = useRouter();
let name = ref("");
try {
  window.atob(String(sessionStorage.getItem("memberLoginInfo")));
} catch (e) {
  router.push("/");
  sessionStorage.removeItem("memberLoginInfo");
}

const { number, password } = JSON.parse(
  window.atob(String(sessionStorage.getItem("memberLoginInfo")))
);
let me = ref<member>(personExample());
let fetched = ref(false);
axios(`${baseurl}member/getinfo/${number}/raw`).then((response) => {
  me.value = response.data.details as member;
  fetched.value = true;
});

axios(`${baseurl}member/${number}/login?password=${password}`).then(
  (response) => {
    if (response.data.status !== "ok") {
      sessionStorage.removeItem("memberLoginInfo");
      router.push("/login/member");
    }
  }
);
let pth = ref(new URL(location.href).pathname);
</script>
<template>
  <el-container>
    <el-aside width="15%">
      <el-menu :default-active="pth" router style="height: 100%">
        <controls-page
          :style="{ paddingBottom: '1em', paddingTop: '0' }"
          type="member"
          :number="number"
          :name="name"
        />
        <el-menu-item index="/member/">
          <el-icon>
            <Odometer />
          </el-icon>
          <template #title> 仪表盘 </template>
        </el-menu-item>
        <el-sub-menu index="/member/department/">
          <template #title>
            <el-icon>
              <List />
            </el-icon>
            <span>数据处理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/member/department/volunteer">
              <template #title> 义工 </template>
            </el-menu-item>
            <el-menu-item
              v-if="
                me.union.duty.includes('deduction') &&
                me.union.position !== 'register'
              "
              index="/member/department/deduction"
            >
              <template #title> 扣分 </template>
            </el-menu-item>
            <el-menu-item index="/member/department/post">
              <template #title> 投稿 </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu
          v-if="
            me.union.position.includes('minister') ||
            me.union.position.includes('chairman')
          "
          index="/member/admin/"
        >
          <template #title>
            <el-icon>
              <Magnet />
            </el-icon>
            <span>管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/member/admin/member">
              <template #title> 成员 </template>
            </el-menu-item>
            <el-menu-item
              v-if="
                ['vice-minister', 'minister'].includes(me.union.position) ||
                me.union.admin.includes('member-volunteer')
              "
              index="/member/admin/member-volunteer"
            >
              <template #title> 成员义工 </template>
            </el-menu-item>
            <el-menu-item
              v-if="me.union.admin.includes('volunteer')"
              index="/member/admin/volunteer"
            >
              <template #title> 义工 </template>
            </el-menu-item>
            <el-menu-item
              v-if="me.union.admin.includes('deduction')"
              index="/member/admin/deduction"
            >
              <template #title> 扣分 </template>
            </el-menu-item>
            <el-menu-item
              v-if="me.union.admin.includes('post')"
              index="/member/admin/post"
            >
              <template #title> 投稿 </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/member/message/">
          <el-icon>
            <Box />
          </el-icon>
          <template #title> 消息中心 </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right">
        <controls-with-back :style="{ textAlign: 'right' }" />
      </el-header>

      <el-main>
        <el-scrollbar :height="Math.floor((heightClient * 8) / 9)">
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
