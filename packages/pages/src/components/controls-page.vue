<!-- @format -->

<script lang="ts" setup>
/* eslint-disable vue/require-default-prop */
import { defineProps, ref, toRefs, reactive } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import generateName from "./generate-name";
import resetPassword from "./reset-password";
import { useRouter } from "vue-router";

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
const openPassword = () => {
  reset_password.value = true;
};
</script>
<template>
  <div :style="{ textAlign: 'center' }">
    <div>
      <el-dropdown plain trigger="click">
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
              {{ t("title.edit-password.title") }}
            </el-dropdown-item>
            <el-dropdown-item @click="exit">
              <el-icon>
                <Close />
              </el-icon>
              {{ t("title.exit-login.title") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
      v-model="reset_password"
      :title="t('title.edit-password.title')"
      width="60%"
    >
      <el-form v-model="newpwd">
        <el-form-item :label="t('title.edit-password.dialog.old')">
          <el-input v-model="newpwd.oldpwd" type="password" />
        </el-form-item>
        <el-form-item :label="t('title.edit-password.dialog.new')">
          <el-input v-model="newpwd.newpwd1" type="password" />
        </el-form-item>
        <el-form-item :label="t('title.edit-password.dialog.new')">
          <el-input v-model="newpwd.newpwd2" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button text bg round @click="reset_password = false">
            {{ t("methods.cancel") }}
          </el-button>
          <el-button
            type="primary"
            text
            bg
            round
            :loading="isSubmitingPassword"
            @click="npd"
          >
            {{ t("methods.submit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
