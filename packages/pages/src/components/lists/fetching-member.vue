<!-- @format -->

<script lang="ts" setup>
/* global defineProps, member_processed */
import { toRefs, ref } from "vue";
import axios from "axios";
import baseurl from "../../modules/baseurl";
import Desc from "./MemberDescription.vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
const router = useRouter();
const props = defineProps<{ number: number; useTag: boolean }>();
const fetched = ref(false);
const { number } = toRefs(props);
const info = ref<member_processed>();
const isOk = ref(true);
const openIt = ref(false);
axios(baseurl + "member/getinfo/" + (number?.value as number)).then(
  (response) => {
    if (response.data.status === "ok") {
      info.value = response.data.details;
      isOk.value = true;
    } else isOk.value = false;
    fetched.value = true;
  }
);

const gotoReg = () => {
  openIt.value = false;
  const params = new URLSearchParams();
  params.set("number", number.value.toString());
  router.push("/class/list/member/register/?" + params.toString());
  ElNotification({
    title: "已在成员界面为您引导到注册。",
    message: '请手动前往班级"成员"页面。',
    type: "info",
  });
};
</script>
<template>
  <div>
    <el-skeleton :loading="!fetched" animated>
      <template #template>
        <el-skeleton-item variant="text" style="width: 4em" />
      </template>
      <template #default>
        <div @click="openIt = true">
          <el-button v-if="isOk && fetched" text bg size="small" type="success">
            {{ info?.name }}
          </el-button>
          <el-button v-else-if="fetched" text bg size="small" type="danger">
            {{ number }}
          </el-button>
        </div>
      </template>
    </el-skeleton>
    <teleport to="body">
      <el-dialog
        v-model="openIt"
        :title="info ? info.name : number"
        width="60%"
        :modal="false"
        draggable
      >
        <div>
          <Desc v-if="fetched && isOk" :data="info"></Desc>
          <el-result
            v-else-if="fetched && !isOk"
            icon="error"
            title="不存在此人"
            sub-title="村中闻有此人，咸来问讯。"
          >
            <template #extra>
              <el-button type="danger" plain @click="gotoReg">去注册</el-button>
            </template>
          </el-result>
        </div>
      </el-dialog>
    </teleport>
  </div>
</template>
