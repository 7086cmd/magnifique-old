<!-- @format -->

<script setup lang="ts">
/* global member */
import { ref, watch } from "vue";
import axios from "axios";
import baseurl from "../../modules/baseurl";
import volunteerPage from "./departments/volunteer.vue";
import personExample from "../../../examples/person";
import DeductionPage from "../../components/powers/deduction/deduction.vue";
import PostPage from "../../components/powers/post/post.vue";
import { useRoute, useRouter } from "vue-router";

const fetched = ref(false);
const route = useRoute();
const router = useRouter();
let choice = ref(route.params.type ?? "");
const { number, password } = JSON.parse(
  window.atob(String(sessionStorage.getItem("memberLoginInfo")))
);
let me = ref<member>(personExample());
axios(`${baseurl}member/getinfo/${number}/raw`).then((response) => {
  me.value = response.data.details as member;
  fetched.value = true;
});
watch(choice, () => {
  router.push(
    "/member/department/" + (choice.value ?? "") + (choice.value ? "/" : "")
  );
});
</script>

<template>
  <div>
    <volunteer-page v-if="route.params.type === 'volunteer'" />
    <post-page
      v-if="route.params.type === 'post'"
      type="member"
      :number="number"
      :password="password"
    />
    <deduction-page
      v-if="route.params.type === 'deduction'"
      type="member"
      :number="number"
      :password="password"
    />
  </div>
</template>
