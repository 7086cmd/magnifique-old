<!-- @format -->

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch } from "vue";
import Deduction from "../../components/powers/deduction/deduction.vue";
import MemberDev from "../../components/powers/member/Member.vue";
import { useRoute, useRouter } from "vue-router";
import Department from "./DepartmentView.vue";
const route = useRoute();
const router = useRouter();
let nativeName = ref(route.params.type ?? "");
const { password } = JSON.parse(
  window.atob(String(localStorage.getItem("adminLoginInfo")))
);
watch(nativeName, () => {
  router.push("/admin/data/" + nativeName.value + (nativeName.value ? "/" : ""));
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
      <member-dev
        v-if="route.params.type === 'member'"
        type="admin"
        :password="password"
      />

      <Department v-if="route.params.type === 'departments'"></Department>
    </div>
  </transition>
</template>
