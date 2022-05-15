<!-- @format -->

<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<script lang="ts" setup>
import { ref, defineProps, toRefs } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import baseurl from "../../modules/baseurl";
import { encode } from "../../components/record-data";
import failfuc from "../../modules/failfuc";
import { useI18n } from "vue-i18n";
import { uniq } from "lodash";

if (!("memberSuggestions" in localStorage)) {
  localStorage.setItem("memberSuggestions", JSON.stringify([]));
}

let suggestions =
  JSON.parse(localStorage.getItem("memberSuggestions") ?? "[]") ?? [];

const { t } = useI18n();

const props = defineProps<{
  numberDef?: string;
  passwordDef?: string;
  redr?: string;
}>();

interface option {
  value: string;
  label: string;
  children?: option[];
}

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
      if (!("memberSuggestions" in localStorage)) {
        localStorage.setItem("memberSuggestions", JSON.stringify([]));
      }
      let item = localStorage.getItem("memberSuggestions") as string;
      let item_json = JSON.parse(item) as { value: string }[];
      item_json.push({ value: String(number.value) });
      item_json = uniq(item_json);
      localStorage.setItem("memberSuggestions", JSON.stringify(item_json));
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
    <el-form-item :label="t('login.number')">
      <el-autocomplete
        v-model="number"
        style="width: 100%"
        :fetch-suggestions="suggestions"
        :disabled="numberDef !== undefined"
      />
    </el-form-item>
    <el-form-item :label="t('login.name')">
      <el-tree-select
        v-model="number"
        :disabled="numberDef !== undefined"
        :data="list"
        filterable
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item :label="t('login.password')">
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
        {{ t("methods.submit") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
