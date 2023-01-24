<!-- @format -->

<script lang="ts" setup>
import deduction from "../../components/powers/deduction/deduction.vue";
import memberDev from "../../components/powers/member/Member.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { gradeid, classid, password } = JSON.parse(
  window.atob(String(localStorage.getItem("classLoginInfo")))
);
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <member-dev
        v-if="!route.params.page"
        :gradeid="gradeid"
        :classid="classid"
        :password="password"
        type="class"
      />
      <br />
      <deduction
        :gradeid="gradeid"
        :classid="classid"
        :password="password"
        type="class"
      />
    </div>
  </transition>
</template>
