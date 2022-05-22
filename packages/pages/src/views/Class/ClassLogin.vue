<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import failfuc from "../../modules/failfuc";
import { createClassLoginer } from "../../modules/auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
let gradeid = ref("");
let classid = ref(0);
let password = ref("");
const grades = ref<{ value: number; label: string }[]>([]);

[1, 2, 3].forEach((item) =>
  grades.value.push({
    label: t("class.grade." + item),
    value: item,
  })
);

async function login() {
  if (isNaN(Number(classid.value))) {
    failfuc("输入的不是班级", "");
    return;
  }
  createClassLoginer(
    Number(gradeid.value),
    Number(classid.value),
    window.btoa(password.value)
  )
    .then((response) => {
      localStorage.setItem("classLoginInfo", response);
      router.push("/class/");
    })
    .catch(() => {
      localStorage.removeItem("classLoginInfo");
    });
}
</script>
<template>
  <transition name="el-zoom-in-top" appear>
    <el-form @submit="login">
      <el-form-item :label="t('login.class')">
        <el-input v-model="classid" outlined style="width: 100%">
          <template #prepend>
            <el-select
              v-model="gradeid"
              outlined
              :style="{ backgroundColor: 'var(--el-fill-color-blank)' }"
            >
              <el-option
                v-for="item in grades"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="t('login.password')">
        <el-input
          v-model="password"
          outlined
          style="width: 100%"
          type="password"
          @keydown.enter="login"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          text
          bg
          round
          type="primary"
          style="width: 100%"
          @click="login"
          v-text="t('methods.submit')"
        />
      </el-form-item>
    </el-form>
  </transition>
</template>
