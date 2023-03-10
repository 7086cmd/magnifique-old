<!-- @format -->

<script setup lang="ts">
/* global member, defineProps */
import { ref, reactive, watch, h } from "vue";
import axios from "axios";
import { Refresh, Plus, Pointer, Delete, Close } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import baseurl from "../../../modules/baseurl";
import personExample from "../../../../examples/person";
import sucfuc from "../../../modules/sucfuc";
import failfuc from "../../../modules/failfuc";
import type { FormInstance } from "element-plus";
import { AddMemberFormRule } from "./member_datas/rules";
import { PatchRules, Notificator } from "./member_datas/map";
import {
  MemberClient,
  MemberListClientForClass,
  login,
  class_login,
} from "./clients";
import { useI18n } from "vue-i18n";
import type Node from "element-plus/es/components/tree/src/model/node";

let positions = ref<
  Array<{
    name: string;
    value: string;
  }>
>([]);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

[
  "none",
  "register",
  "clerk",
  "vice-minister",
  "minister",
  "vice-chairman",
  "chairman",
].forEach((item) => {
  positions.value.push({
    name: t("powers.member.position." + item),
    value: item,
  });
});

async function createEditionMap(
  before: Node,
  after: Node
): Promise<PatchRules | undefined> {
  if (Number.isInteger(Number(after.parent.data.value))) {
    Notificator(h("span", null, ["非法操作。"]), "error");
  } else if (after.parent.data.value.includes("_")) {
    const info = after.parent.data.value;
    const [department, position] = info.split("_");
    const patch = new PatchRules({
      number: Number(before.data.value),
      position,
      department,
    });
    await (client as MemberClient)?.put(patch.to_obj().number, patch);
    return patch;
  } else if (after.data.value.includes("_")) {
    const info = after.data.value;
    const [department, position] = info.split("_");
    const patch = new PatchRules({
      number: Number(before.data.value),
      position,
      department,
    });
    await (client as MemberClient)?.put(patch.to_obj().number, patch);
    return patch;
  }
}
const form = ref<FormInstance>();
const props = defineProps<{
  type: "member_admin" | "admin" | "class";
  number?: number;
  classid?: number;
  gradeid?: number;
  password: string;
}>();
const current =
  props.type === "class"
    ? "/class/list"
    : props.type === "admin"
    ? "/admin/data"
    : "/member/admin";
const client =
  props.type === "class"
    ? // eslint-disable-next-line prettier/prettier
      new MemberListClientForClass((props as unknown) as class_login)
    : // eslint-disable-next-line prettier/prettier
      new MemberClient((props as unknown) as login);
let isRegistingMember = ref(route.params.status === "register");
const isFetchComplete = ref(false);
let isSubmiting = ref(false);
const information: member = reactive(personExample());
information.number = Number(route.query.number) ?? 0;
if (Number.isNaN(information.number)) information.number = 0;
information.union.department = (route.query.department as string) ?? "";
information.union.position = ((route.query.position as string) ?? "none") as
  | "register"
  | "clerk"
  | "vice-minister"
  | "minister"
  | "vice-chairman"
  | "chairman"
  | "none";
information.name = (route.query.name as string) ?? "";
const departments = ref<
  {
    name: string;
    value: string;
  }[]
>([
  {
    name: "主席团",
    value: "",
  },
]);
let types = ref(positions);
let vadmins = ref<
  {
    name: string;
    value: string;
  }[]
>([]);
interface Tree {
  value: string;
  label: string;
  children?: Tree[];
}
let positionCannotEdit = ref(false);
let departmentCannotEdit = ref(false);
let table = ref<Tree[]>([]);
let loading = ref(false);
axios(`${baseurl}department/list`).then((response) => {
  departments.value.push(...response.data.details);
});
if (props.type === "member_admin") {
  types.value = types.value.filter(
    (x) => !["minister", "vice-chairman", "chairman"].includes(x.value)
  );
  departments.value = departments.value.filter((x) => x.value);
  axios(`${baseurl}member/getinfo/${props.number}/raw`).then((response) => {
    if (response.data.details.union.position.includes("chairman")) {
      information.union.position = "register";
      positionCannotEdit.value = true;
    } else if (response.data.details.union.position.includes("minister")) {
      departmentCannotEdit.value = true;
      information.union.department = response.data.details.union.department;
      if (response.data.details.union.position.includes("vice")) {
        information.union.position = "register";
        positionCannotEdit.value = true;
      }
    }
  });
}
if (props.type === "class") {
  departments.value = departments.value.filter((x) => x.value);
  information.union.position = "register";
  positionCannotEdit.value = true;
}
axios(`${baseurl}power/list`).then((response) => {
  vadmins.value.push(...response.data.details);
});
const refresh = async () => {
  loading.value = true;
  isFetchComplete.value = false;
  const response = await client?.get();
  loading.value = false;
  isFetchComplete.value = true;
  if (response.data.status === "ok") {
    table.value = response.data.details;
  }
};
refresh();
const deletePerson = async (number: number) => {
  loading.value = true;
  const response = await (client as MemberClient)?.delete(number);
  if (response.data.status === "ok") {
    sucfuc();
  } else {
    failfuc(response.data.reason, response.data.text);
  }
  refresh();
};
const vioPerson = async (number: number) => {
  loading.value = true;
  const response = await (client as MemberClient)?.patch(number);
  if (response.data.status === "ok") {
    sucfuc();
  } else {
    failfuc(response.data.reason, response.data.text);
  }
  refresh();
};
let beTheViceMinisterInTheSameTime = ref(false);
const createMember = async () => {
  loading.value = true;
  isRegistingMember.value = false;
  isSubmiting.value = true;
  const createMsg = (msg: string) => {
    ElMessageBox.alert(msg, "失败", {
      center: true,
      type: "error",
    });
  };
  if (information.number >= 21000000 || information.number <= 20000000) {
    createMsg("不正确的号码");
  } else if (information.name === "") {
    createMsg("不正确的姓名");
  } else if (
    information.union.department === "" &&
    !information.union.position.includes("chairman")
  ) {
    createMsg("不正确的部门");
  } else if (information.union.position === "none") {
    createMsg("不正确的职位");
  } else if (
    information.union.position === "vice-chairman" &&
    information.union.admin.length === 0
  ) {
    createMsg("不正确的职位");
  } else {
    try {
      information.union.duty = (
        await axios(`${baseurl}department/${information.union.department}/duty`)
      ).data.details as ("deduction" | "post" | "radio" | "volunteer")[];
    } catch (_e) {
      information.union.duty = [];
    }
    if (information.union.duty === undefined) {
      information.union.duty = [];
    }
    information.union.leader =
      information.union.position.includes("chairman") ||
      information.union.position === "minister";
    if (information.union.position === "minister") {
      information.union.admin = [...information.union.duty, "member"];
    }
    if (information.union.position === "chairman") {
      information.union.admin = ["deduction", "post", "radio", "volunteer"];
    }
    if (beTheViceMinisterInTheSameTime.value) {
      information.union.admin.push("member-volunteer");
    }
    const response = await client?.post(information);
    isSubmiting.value = false;
    if (response.data.status === "ok") {
      sucfuc();
    } else {
      failfuc(response.data.reason, response.data.text);
    }
    form?.value?.resetFields();
    information.union.position = "clerk";
    refresh();
  }
};
watch(isRegistingMember, () => {
  if (isRegistingMember.value === true)
    router.push(current + "/member/register/");
  else router.push(current + "/member/");
});
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #default>
        <el-tooltip
          :content="t('powers.method.refresh')"
          placement="bottom"
          effect="light"
        >
          <el-button
            type="success"
            circle
            text
            bg
            :icon="Refresh"
            @click="refresh"
          />
        </el-tooltip>
        <el-tooltip
          :content="
            isRegistingMember
              ? t('powers.method.close')
              : t('powers.method.add')
          "
          placement="bottom"
          effect="light"
        >
          <el-button
            :type="isRegistingMember ? 'danger' : 'primary'"
            circle
            text
            bg
            :icon="isRegistingMember ? Close : Plus"
            @click="isRegistingMember = !isRegistingMember"
          />
        </el-tooltip>
        <el-divider />

        <el-collapse-transition>
          <el-form
            v-if="isRegistingMember"
            ref="form"
            :model="information"
            :rules="AddMemberFormRule"
            :title="t('powers.method.add')"
          >
            <el-form-item :label="t('powers.member.add.name')">
              <el-input v-model="information.name" />
            </el-form-item>
            <el-form-item :label="t('powers.member.add.number')">
              <el-input v-model="information.number" />
            </el-form-item>
            <el-form-item :label="t('powers.member.add.department')">
              <el-select
                v-model="information.union.department"
                :disabled="departmentCannotEdit"
                style="width: 100%"
              >
                <el-option
                  v-for="item in departments"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="t('powers.member.add.position')">
              <el-select
                v-model="information.union.position"
                :disabled="positionCannotEdit"
                style="width: 100%"
              >
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="information.union.position === 'vice-chairman'"
              :label="t('powers.member.add.powers')"
            >
              <el-select
                v-model="information.union.admin"
                multiple
                collapse-tags
                style="width: 100%"
              >
                <el-option
                  v-for="item in vadmins"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-checkbox
                v-if="information.union.department !== ''"
                v-model="beTheViceMinisterInTheSameTime"
                :label="t('powers.member.add.sametime')"
              ></el-checkbox>
            </el-form-item>
            <el-button
              v-loading="isSubmiting"
              round
              text
              bg
              type="primary"
              @click="createMember"
            >
              {{ t("methods.submit") }}
            </el-button>
          </el-form>
        </el-collapse-transition>

        <el-collapse-transition>
          <el-tree
            v-if="!isRegistingMember"
            v-loading="!isFetchComplete"
            :data="table"
            :draggable="!positionCannotEdit"
            @node-drop="createEditionMap"
          >
            <template #default="{ node }">
              <el-row v-if="Number.isInteger(Number(node.data.value))">
                <el-col :span="14">
                  <member-dialog
                    :number="Number(node.data.value)"
                  ></member-dialog>
                </el-col>
                <el-col v-if="!positionCannotEdit" :span="5">
                  <el-popconfirm
                    title="确定要删除成员吗？"
                    @confirm="deletePerson(node.data.value)"
                  >
                    <template #reference>
                      <el-link :underline="false" type="danger" :icon="Delete">
                      </el-link>
                    </template>
                  </el-popconfirm>
                </el-col>
                <el-col v-if="!positionCannotEdit" :span="5">
                  <el-popconfirm
                    title="确定要删除15分的素质分吗？"
                    @confirm="vioPerson(node.data.value)"
                  >
                    <template #reference>
                      <el-link
                        :underline="false"
                        type="warning"
                        :icon="Pointer"
                      >
                      </el-link>
                    </template>
                  </el-popconfirm>
                </el-col>
              </el-row>
              <el-link
                v-else
                :underline="false"
                :type="node.data.value === 'not' ? 'error' : 'default'"
              >
                {{ node.label }}
              </el-link>
            </template>
          </el-tree>
        </el-collapse-transition>
      </template>
    </el-card>
  </div>
</template>
