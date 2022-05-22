<!-- @format -->

<script lang="ts" setup>
import { ref, watch } from "vue";
import controls from "../components/controls-with-back.vue";
import MemberLogin from "./Member/Login.vue";
import ClassLogin from "./Class/ClassLogin.vue";
import { useRouter, useRoute } from "vue-router";
import AdminLogin from "./Admin/Login.vue";
import { useWebNotification } from "@vueuse/core";
import { ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
  title: t("login.notify.welcome"),
  dir: "auto",
  lang: "zh-cn",
}).isSupported;

if (!supportment) {
  ElMessageBox.alert(t("login.notify.unopen"), t("login.notify.request"), {
    center: true,
    type: "warning",
  });
}
</script>

<template>
  <div>
    <el-container>
      <el-header style="text-align: right; height: 10%">
        <controls />
      </el-header>
      <el-container>
        <el-aside width="30%"></el-aside>
        <el-main style="padding-top: 2%">
          <h3>Magnifique</h3>
          <el-tabs v-model="choice">
            <el-tab-pane name="member" :label="t('login.methods.member')">
              <member-login></member-login>
              <el-button
                style="width: 100%"
                text
                bg
                round
                :disabled="!memberEntranceAble"
                @click="toTag('member')"
                v-text="t('login.entrance')"
              />
            </el-tab-pane>
            <el-tab-pane name="class" :label="t('login.methods.class')">
              <class-login></class-login>
              <el-button
                style="width: 100%"
                text
                bg
                round
                :disabled="!classEntranceAble"
                @click="toTag('class')"
                v-text="t('login.entrance')"
              />
            </el-tab-pane>
            <el-tab-pane name="admin" :label="t('login.methods.admin')">
              <admin-login></admin-login>
              <el-button
                style="width: 100%"
                text
                bg
                round
                :disabled="!adminEntranceAble"
                @click="toTag('admin')"
                v-text="t('login.entrance')"
              />
            </el-tab-pane>
          </el-tabs>
        </el-main>
        <el-aside width="30%"> </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
