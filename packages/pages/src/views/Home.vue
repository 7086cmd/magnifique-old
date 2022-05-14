<!-- @format -->

<script lang="ts" setup>
import { ref, watch } from "vue";
import controls from "../components/controls.vue";
import MemberLogin from "./Member/Login.vue";
import ClassLogin from "./Class/ClassLogin.vue";
import { useRouter, useRoute } from "vue-router";
import AdminLogin from "./Admin/Login.vue";
import { useWebNotification } from "@vueuse/core";
import { ElMessageBox } from "element-plus";

let classEntranceAble = ref("classLoginInfo" in localStorage);
let memberEntranceAble = ref("memberLoginInfo" in sessionStorage);
let adminEntranceAble = ref("adminLoginInfo" in localStorage);

const router = useRouter();
const route = useRoute();

const choice = ref(route.params.type ?? "class");

watch(choice, () => {
  router.push("/login/" + choice.value);
});

const toTag = (tag: string) => {
  router.push("/" + tag + "/");
};

const supportment = useWebNotification({
  title: "欢迎使用Magnifique",
  dir: "auto",
  lang: "zh-cn",
}).isSupported;

if (!supportment) {
  ElMessageBox.alert("请开启通知", "未开启通知", {
    center: true,
    type: "warning",
  });
}
</script>

<template>
  <div className="background_must_be_gray">
    <el-container>
      <el-header style="text-align: right; height: 10%">
        <controls />
      </el-header>
      <el-container>
        <el-aside width="30%"></el-aside>
        <el-main style="padding-top: 2%">
          <h3>登录 Magnifique.</h3>
          <el-card shadow="never">
            <el-tabs v-model="choice">
              <el-tab-pane name="class" label="班级登录">
                <class-login></class-login>
                <el-button
                  style="width: 100%"
                  text
                  bg
                  round
                  :disabled="!classEntranceAble"
                  @click="toTag('class')"
                >
                  根据登录信息直接进入
                </el-button>
              </el-tab-pane>
              <el-tab-pane name="member" label="成员登录">
                <member-login></member-login>
                <el-button
                  style="width: 100%"
                  text
                  bg
                  round
                  :disabled="!memberEntranceAble"
                  @click="toTag('member')"
                >
                  根据登录信息直接进入
                </el-button>
              </el-tab-pane>
              <el-tab-pane name="admin" label="管理员登录">
                <admin-login></admin-login>
                <el-button
                  style="width: 100%"
                  text
                  bg
                  round
                  :disabled="!adminEntranceAble"
                  @click="toTag('admin')"
                >
                  根据登录信息直接进入
                </el-button>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-main>
        <el-aside width="30%"> </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
