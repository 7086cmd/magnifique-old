<!-- @format -->

<script lang="ts" setup>
import deduction from "../../components/powers/deduction/deduction.vue";
import post from "../../components/powers/post/post.vue";
import volunteer from "./lists/volunteer.vue";
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
        v-if="!route.params.page || route.params.page === 'member'"
        :gradeid="gradeid"
        :classid="classid"
        :password="password"
        type="class"
      />
      <deduction
        v-if="route.params.page === 'deduction'"
        :gradeid="gradeid"
        :classid="classid"
        :password="password"
        type="class"
      />
      <post
        v-if="route.params.page === 'post'"
        :gradeid="gradeid"
        :classid="classid"
        :password="password"
        type="class"
      />
      <volunteer v-if="route.params.page === 'volunteer'" />
    </div>
  </transition>
</template>
