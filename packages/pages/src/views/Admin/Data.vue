<!-- @format -->

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch } from "vue";
import Deduction from "../../components/powers/deduction/deduction.vue";
import PostDev from "../../components/powers/post/post.vue";
import Volunteer from "./data/volunteer.vue";
import MemberDev from "../../components/powers/member/Member.vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
let nativeName = ref(route.params.type ?? "");
const { password } = JSON.parse(
  window.atob(String(localStorage.getItem("adminLoginInfo")))
);
watch(nativeName, () => {
  router.push(
    "/admin/data/" + nativeName.value + (nativeName.value ? "/" : "")
  );
});
</script>

<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-tabs v-model="nativeName" tab-position="left">
        <el-tab-pane label="扣分" name="deduction" lazy>
          <deduction type="admin" :password="password" />
        </el-tab-pane>
        <el-tab-pane label="稿件" name="post" lazy>
          <post-dev type="admin" :password="password" />
        </el-tab-pane>
        <el-tab-pane label="义工" name="volunteer" lazy>
          <volunteer />
        </el-tab-pane>
        <el-tab-pane label="成员" name="member" lazy>
          <!-- <member /> -->
          <member-dev type="admin" :password="password" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>
