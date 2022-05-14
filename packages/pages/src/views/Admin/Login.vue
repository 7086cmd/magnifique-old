<!-- @format -->

<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import baseurl from "../../modules/baseurl";
import failfuc from "../../modules/failfuc";
const router = useRouter();

let password = ref("");

const login = () => {
  axios(`${baseurl}admin/login?password=${window.btoa(password.value)}`).then(
    (response) => {
      if (response.data.status == "ok") {
        router.push("/admin/");
        localStorage.setItem(
          "adminLoginInfo",
          window.btoa(
            JSON.stringify({
              password: window.btoa(password.value),
            })
          )
        );
      } else {
        localStorage.removeItem("adminLoginInfo");
        failfuc(response.data.reason, response.data.text);
      }
    }
  );
};
</script>

<template>
  <el-form>
    <el-form-item label="密码">
      <el-input v-model="password" type="password" @keydown.enter="login" />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        style="width: 100%"
        text
        bg
        round
        @click="login"
      >
        确定
      </el-button>
    </el-form-item>
  </el-form>
</template>
