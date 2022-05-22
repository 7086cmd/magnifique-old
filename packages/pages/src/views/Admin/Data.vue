<!-- @format -->

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch } from "vue";
import Deduction from "../../components/powers/deduction/deduction.vue";
import PostDev from "../../components/powers/post/post.vue";
import Volunteer from "./data/volunteer.vue";
import MemberDev from "../../components/powers/member/Member.vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
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
      <deduction
        v-if="route.params.type === 'deduction'"
        type="admin"
        :password="password"
      />
      <post-dev
        v-if="route.params.type === 'post'"
        type="admin"
        :password="password"
      />
      <volunteer v-if="route.params.type === 'volunteer'" />
      <member-dev
        v-if="route.params.type === 'member'"
        type="admin"
        :password="password"
      />
    </div>
  </transition>
</template>
