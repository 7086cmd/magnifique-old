<!-- @format -->

<script lang="ts" setup>
/* eslint-disable vue/require-default-prop */
import { defineProps, ref, toRefs, reactive } from "vue";
import { Close, Minus, Plus } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import generateName from "./generate-name";
import resetPassword from "./reset-password";
import { useRouter } from "vue-router";
import { hideWindow, minWindow, maxWindow } from "../tauri";
import { Moon, Sunny } from "@element-plus/icons-vue";
import { useDark } from "@vueuse/core";
import { useToggle } from "@vueuse/shared";

const router = useRouter();

const props = defineProps({
  type: String,
  number: Number,
  name: String,
  gradeid: Number,
  classid: Number,
});
let isSubmitingPassword = ref(false);

let reset_password = ref(false);
let newpwd = reactive({
  oldpwd: "",
  newpwd1: "",
  newpwd2: "",
});

const { t } = useI18n();
let isClient = ref(false);
const { type, number: numb, gradeid, classid } = toRefs(props);
let name = ref("");
(async () => {
  name.value = String(await generateName(type, numb, classid, gradeid));
})();
const npd = () => {
  isSubmitingPassword.value = true;
  resetPassword(
    type,
    {
      gradeid: gradeid?.value,
      classid: classid?.value,
      number: numb?.value,
    },
    newpwd,
    t,
    router
  );
  isSubmitingPassword.value = false;
};
const exit = () => {
  if (type?.value !== undefined) {
    try {
      sessionStorage.removeItem(type?.value + "LoginInfo");
      localStorage.removeItem(type?.value + "LoginInfo");
      router.push("/");
      // eslint-disable-next-line no-empty
    } catch (_e) {}
  }
};

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true;
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

const closeServer = () => {
  isClient.value && window.magnifique.closeServer();
  hideWindow();
};
const minServerWindow = () => {
  isClient.value && window.magnifique.minServerWindow();
  minWindow();
};
const maxServerWindow = () => {
  isClient.value && window.magnifique.maxServerWindow();
  maxWindow();
};
const openPassword = () => {
  reset_password.value = true;
};
const isInTauri = ref("__TAURI_IPC__" in window || isClient.value);
const isDark = useDark();
</script>
<template>
  <div style="text-align: center">
    <div style="text-align: right">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        active-color="#2c2c2c"
        :inactive-icon="Sunny"
        inactive-color="#f2f2f2"
        @change="useToggle(isDark)"
      />
      <el-divider direction="vertical"></el-divider>
      <el-dropdown split-button plain>
        <el-icon>
          <User />
        </el-icon>
        {{ name }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openPassword">
              <el-icon>
                <Edit />
              </el-icon>
              {{ t("class-dropdown.edit-password") }}
            </el-dropdown-item>
            <el-dropdown-item @click="exit">
              <el-icon>
                <Close />
              </el-icon>
              {{ t("class-dropdown.log-out") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-divider direction="vertical"></el-divider>
      Magnifique v2.0.0
      <el-divider v-if="isInTauri" direction="vertical" />
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Minus"
        type="warning"
        text
        @click="minServerWindow()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Plus"
        type="success"
        text
        @click="maxServerWindow()"
      >
      </el-button>
      <el-button
        v-if="isInTauri"
        style="text-align: right"
        :icon="Close"
        type="danger"
        text
        @click="closeServer()"
      >
      </el-button>
    </div>
    <el-drawer
      v-model="reset_password"
      title="修改密码"
      direction="rtl"
      size="40%"
      style="text-align: center"
    >
      <el-form v-model="newpwd">
        <el-form-item label="原密码">
          <el-input v-model="newpwd.oldpwd" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newpwd.newpwd1" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newpwd.newpwd2" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="reset_password = false"> 取消 </el-button>
          <el-button
            type="primary"
            plain
            :loading="isSubmitingPassword"
            @click="npd"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
