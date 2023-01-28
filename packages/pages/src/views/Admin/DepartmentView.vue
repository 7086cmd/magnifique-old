<!-- @format -->

<script lang="ts" setup>
/* global departmentList */
import axios from "axios";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import baseurl from "../../modules/baseurl";
import { Refresh, Plus, Delete, Edit, Close } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const template = {
  name: "",
  duty: [],
  description: "",
  classes: [],
  groups: [],
};

const duties = {
  deduction: "扣分",
  post: "投稿",
  volunteer: "义工",
  member: "成员",
};

// Get all departments

const departments = ref<departmentList>([]);

axios(`${baseurl}admin/departments`).then((resp) => {
  departments.value = resp.data.details;
  console.log(departments.value);
});

const creating = ref(false);
</script>

<template>
  <div>
    <!-- <p style="font-size: 32px">部门管理</p> -->
    <ElDivider />
    <div>
      <ElButton circle text bg :icon="Refresh" type="primary" />
      <ElButton
        v-if="creating"
        text
        circle
        bg
        :icon="Close"
        type="danger"
        @click="creating = !creating"
      />
      <ElButton
        v-else
        circle
        text
        bg
        :icon="Plus"
        type="success"
        @click="creating = !creating"
      />
    </div>
    <ElDivider />
    <ElCollapseTransition>
      <ElRow v-if="!creating">
        <ElCol v-for="item in departments" :key="item.id" :span="8">
          <ElCard
            shadow="never"
            style="
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            "
          >
            <p style="font-size: 24px; text-align: center">
              {{ item.name }}

              <ElButton circle text bg :icon="Edit" size="small" type="warning" />
              <ElButton circle text bg :icon="Delete" size="small" type="danger" />
            </p>
            <p style="font-size: 14px">部门 ID ：{{ item.id }}</p>
            <p style="font-size: 16px">
              部门职责：<ElTag v-for="duty in item.duty" :key="duty">{{
                duties[duty]
              }}</ElTag
              ><span v-if="item.duty.length === 0">无</span>
            </p>
          </ElCard>
        </ElCol>
      </ElRow>
    </ElCollapseTransition>
  </div>
</template>
