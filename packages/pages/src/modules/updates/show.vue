<!-- @format -->

<script lang="ts" setup>
import { ref } from "vue";
import { getUpd } from "./fetch";

const text = ref("");
const ver = ref("");
const fetching = ref(true);
const isDialogOpen = ref(false);
async function ft() {
  let upd = await getUpd();
  text.value = upd.content;
  ver.value = upd.version;
  fetching.value = false;
  isDialogOpen.value = !("version_readed_" + ver.value in localStorage);
}
const setReaded = () => {
  localStorage.setItem("version_readed_" + ver.value, "true");
  isDialogOpen.value = false;
};
ft();
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="isDialogOpen" width="80%" title="更新日志">
      <el-scrollbar v-loading="fetching" :height="720" always>
        <v-md-editor v-model="text" mode="preview"></v-md-editor>
      </el-scrollbar>
      <p :style="{ textAlign: 'right' }">
        <el-row>
          <el-col :span="5">
            <el-button
              bg
              text
              :style="{ width: '100%' }"
              @click="isDialogOpen = false"
            >
              没收到，还要再看
            </el-button>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="18">
            <el-button
              bg
              type="primary"
              text
              :style="{ width: '100%' }"
              @click="setReaded"
            >
              收到，不再显示。
            </el-button>
          </el-col>
        </el-row>
      </p>
    </el-dialog>
  </teleport>
</template>
