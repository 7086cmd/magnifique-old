<!-- @format -->

<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script lang="ts" setup>
/* global option */
import { ref, defineProps, toRefs } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import baseurl from "../../modules/baseurl";
import { encode } from "../../components/record-data";
import failfuc from "../../modules/failfuc";

const props = defineProps<{
  numberDef?: string;
  passwordDef?: string;
  redr?: string;
}>();

const { numberDef, passwordDef, redr } = toRefs(props);
const router = useRouter();
const list = ref<option[]>([]);
let number = ref(numberDef?.value ?? "");
let password = ref(passwordDef?.value ?? "");
axios(`${baseurl}auth/member/list`).then((response) => {
  list.value = response.data.details;
});
const login = () => {
  axios(
    `${baseurl}member/${number.value}/login?password=${window.btoa(
      password.value
    )}`
  ).then((response) => {
    if (response.data.status == "ok") {
      router.push(redr?.value ?? "/member/");
      sessionStorage.setItem(
        "memberLoginInfo",
        encode({
          number: number.value,
          password: window.btoa(password.value),
        })
      );
    } else {
      localStorage.removeItem("memberLoginInfo");
      failfuc(response.data.reason, response.data.text);
    }
  });
};
</script>

<template>
  <el-form>
    <el-form-item label="学号">
      <el-input v-model="number" :disabled="numberDef !== undefined" />
    </el-form-item>
    <el-form-item label="姓名">
      <el-tree-select
        v-model="number"
        :disabled="numberDef !== undefined"
        :data="list"
        filterable
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="password" type="password" @keydown.enter="login" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" plain round @click="login">
        确定
      </el-button>
    </el-form-item>
  </el-form>
</template>
