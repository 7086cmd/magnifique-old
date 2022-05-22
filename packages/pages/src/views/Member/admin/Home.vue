<!-- @format -->

<script setup lang="ts">
/* global member */
import { ref, watch } from "vue";
import axios from "axios";
import baseurl from "../../../modules/baseurl";
import DeductionPage from "../../../components/powers/deduction/deduction.vue";
import PostPage from "../../../components/powers/post/post.vue";
import MemberPageDev from "../../../components/powers/member/Member.vue";
import VolunteerPage from "./volunteer.vue";
import personExample from "../../../../examples/person";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { number, password } = JSON.parse(
  window.atob(String(sessionStorage.getItem("memberLoginInfo")))
);
let choice = ref(route.params.type ?? "");
let got = ref(false);
let me = ref<member>(personExample());
axios(`${baseurl}member/getinfo/${number}/raw`).then((response) => {
  me.value = response.data.details as member;
  got.value = true;
});
watch(choice, () => {
  router.push(
    "/member/admin/" + (choice.value ?? "") + (choice.value ? "/" : "")
  );
});
</script>

<template>
  <div>
    <member-page-dev
      v-if="route.params.type === 'member'"
      type="member_admin"
      :number="number"
      :password="password"
    />
    <deduction-page
      v-if="route.params.type === 'deduction'"
      type="member_admin"
      :number="number"
      :password="password"
    />
    <post-page
      v-if="route.params.type === 'post'"
      type="member_admin"
      :number="number"
      :password="password"
    />
    <volunteer-page
      v-if="route.params.type === 'member-volunteer'"
      type="member"
    />
    <volunteer-page v-if="route.params.type === 'volunteer'" type="volunteer" />
  </div>
</template>
