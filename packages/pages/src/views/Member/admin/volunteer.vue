<!-- @format -->

<script lang="ts" setup>
/* global VolunteerQueryResult, member_processed, member */
import { ref, reactive, defineProps, Ref } from "vue";
import axios from "axios";
import { Refresh } from "@element-plus/icons-vue";
import baseurl from "../../../modules/baseurl";
import volunteerExample from "../../../../examples/volunteer";
import failfuc from "../../../modules/failfuc";
import sucfuc from "../../../modules/sucfuc";
import VolunteerDescription from "../../../components/lists/VolunteerDescription.vue";
import personExample from "../../../../examples/person";
import dayjs from "dayjs";
import { v4 } from "uuid";
import toPort from "../../../modules/to-port";

const { password, number } = JSON.parse(
  window.atob(String(sessionStorage.getItem("memberLoginInfo")))
);

const props = defineProps<{ type: "member" | "volunteer" }>();

let aboutme = ref<member>(personExample());

const information: member = reactive(personExample());
let isSubmiting = ref(false);
let isRegistingVolunteer = ref(false);
let volunteerData = reactive(volunteerExample());
volunteerData.status = "planning";
let persons = ref<member_processed[]>([]);
let loading = ref(true);
let volunteerDetail = ref<VolunteerQueryResult[]>([]);
axios(`${baseurl}member/getinfo/${number}/raw`).then((response) => {
  aboutme.value = response.data.details as member;
  axios(
    `${baseurl}member/admin/${number}/get/${
      props.type === "volunteer"
        ? "core"
        : (aboutme.value as member).union.department
    }/member?password=${password}`
  ).then((responser) => {
    persons.value = responser.data.details;
  });
  refresh();
  information.union.department = aboutme.value.union.department;
});
const refresh = () => {
  loading.value = true;
  axios(
    `${baseurl}member/admin/${number}/get/${
      props.type === "volunteer"
        ? "core"
        : (aboutme.value as member).union.department
    }/volunteer?password=${password}`
  ).then((response) => {
    loading.value = false;
    if (response.data.status == "ok") {
      volunteerDetail.value = response.data.details as VolunteerQueryResult[];
    }
  });
};
const createRegistry = async () => {
  if (volunteerData.person.length == 0) {
    failfuc("??????????????????", "");
  } else if (volunteerData.project === "") {
    failfuc("??????????????????????????????", "");
  } else if (volunteerData.place == "") {
    failfuc("??????????????????", "");
  } else if (!dayjs(volunteerData.time).isValid()) {
    failfuc("?????????????????????", "");
  } else {
    isSubmiting.value = true;
    const response = await axios(`${baseurl}member/admin/create/volunteer`, {
      data: {
        volunteer: volunteerData,
        password,
        number,
      },
      method: "post",
    });
    isSubmiting.value = false;
    if (response.data.status === "ok") {
      volunteerData.time = dayjs().toJSON();
      volunteerData.createId = v4();
      volunteerData.person = [];
      volunteerData.project = "";
      volunteerData.place = "";
      refresh();
      sucfuc();
    } else {
      failfuc(response.data.reason, response.data.text);
    }
  }
};
let editId = ref<string>();
const editStatusVolunteer = (person: number[]) => {
  axios(`${baseurl}member/admin/edit/volunteer`, {
    data: {
      password,
      volunteerInfo: {
        person: person,
        id: editId.value,
        status: "done",
      },
      number,
    },
    method: "post",
  }).then((response) => {
    if (response.data.status == "ok") {
      sucfuc();
    } else {
      failfuc(response.data.reason, response.data.text);
    }
  });
};
const deleteVolunteer = (props: { row: VolunteerQueryResult }) => {
  axios(`${baseurl}member/admin/delete/volunteer`, {
    data: {
      password,
      volunteerInfo: {
        person: props.row.person,
        id: props.row.createId,
      },
      number,
    },
    method: "post",
  }).then((response) => {
    if (response.data.status === "ok") {
      sucfuc();
    } else {
      failfuc(response.data.reason, response.data.text);
    }
  });
};
let isExporting = ref(false);
let exportTime = ref<string[]>([]);
const ExportStart = () => {
  isExporting.value = true;
};
let isClient = ref(false);

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true;
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}
const createExport = async () => {
  isSubmiting.value = true;
  const response = await axios(`${baseurl}member/admin/export/volunteer`, {
    data: {
      password,
      config:
        exportTime.value.length == 0
          ? undefined
          : {
              start: dayjs(exportTime.value[0]).toJSON(),
              end: dayjs(exportTime.value[1]).toJSON(),
            },
      number,
      department:
        props.type === "member" ? aboutme.value.union.department : undefined,
      type: props.type === "member" ? "department" : "all",
    },
    method: "post",
  });
  isSubmiting.value = false;
  if (response.data.status == "ok") {
    sucfuc();
    window.open(
      toPort(`${baseurl}admin/export/download/${response.data.details.token}`),
      isClient.value ? "_self" : "_blank"
    );
  } else {
    failfuc(response.data.reason, response.data.text);
  }
};

let isCheckin = ref(false);
let doneMember = ref<number[]>([]);
interface options {
  key: number;
  label: string;
  disabled: boolean;
}
let waitForChoose: Ref<options[]> = ref([]);
const startPassing = (props: { row: VolunteerQueryResult }) => {
  editId.value = props.row.createId;
  isCheckin.value = true;
  waitForChoose.value = persons.value
    .filter((item) => {
      const persons = props.row.person;
      const afterMap = persons.map((x) => Number(x));
      return afterMap.includes(Number(item.number));
    })
    .map(
      (item) =>
        ({
          key: Number(item.number),
          label: String(item.name),
          disabled: false,
        } as options)
    );
  doneMember.value = props.row.records
    .filter((x) => x.status === "done")
    .map((x) => Number(x.person));
};
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
        <template #default>
          <el-card shadow="never">
            <el-table
              :data="volunteerDetail"
              highlight-current-row
              max-height="480px"
            >
              <el-table-column type="expand">
                <template #header>
                  <el-button type="text" :icon="Refresh" @click="refresh()" />
                </template>
                <template #default="prop">
                  <volunteer-description :data="prop.row" />
                </template>
              </el-table-column>
              <el-table-column label="?????????">
                <template #default="prop">
                  <el-tag
                    v-if="typeof prop.row.person === 'number'"
                    type="success"
                    v-text="prop.row.person"
                  />
                  <el-tag
                    v-for="item in prop.row.person"
                    v-else
                    :key="item"
                    type="success"
                    v-text="item"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="project" label="????????????" />
              <el-table-column label="????????????">
                <template #default="prop">
                  {{ prop.row.duration }}??????
                </template>
              </el-table-column>
              <el-table-column align="right" fixed="right">
                <template #header>
                  <el-button type="text" @click="isRegistingVolunteer = true">
                    ????????????
                  </el-button>
                  <el-button type="text" @click="ExportStart()">
                    ??????
                  </el-button>
                </template>
                <template #default="prop">
                  <el-button type="text" @click="startPassing(prop)">
                    ??????
                  </el-button>
                  <el-button
                    type="text"
                    :disabled="prop.row.status === 'miss'"
                    @click="deleteVolunteer(prop)"
                  >
                    ??????
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </template>
      </el-skeleton>
      <el-dialog v-model="isRegistingVolunteer" title="????????????" center>
        <template #header>????????????</template>
        <el-form v-model="volunteerData" title="????????????">
          <el-form-item label="????????????">
            <el-date-picker
              v-model="volunteerData.time"
              type="datetime"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="????????????">
            <el-select
              v-model="volunteerData.person"
              style="width: 100%"
              multiple
              filterable
            >
              <el-option
                v-for="item in persons.sort(
                  (item1, item2) => item1.volunteer - item2.volunteer
                )"
                :key="item.number"
                :label="item.name"
                :value="item.number"
              >
                <span style="float: left" v-text="item.name"></span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ item.volunteer }}??????????????????</span
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="????????????">
            <el-input v-model="volunteerData.project"></el-input>
          </el-form-item>
          <el-form-item label="????????????">
            <el-input
              v-model="volunteerData.place"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="????????????">
            <el-slider
              v-model="volunteerData.duration"
              :step="0.5"
              :min="0"
              :max="3"
            ></el-slider>
            <!-- ????????????????????????3?????? -->
            <el-input-number
              v-model="volunteerData.duration"
              style="width: 100%"
              :step="0.5"
            />
          </el-form-item>
          <el-form-item label="??????ID">
            <el-input v-model="volunteerData.createId" readonly></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="isRegistingVolunteer = false"> ?????? </el-button>
            <el-button
              type="primary"
              :loading="isSubmiting"
              @click="createRegistry"
            >
              ??????
            </el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="isExporting" title="????????????" center>
        <el-date-picker
          v-model="exportTime"
          type="datetimerange"
          style="width: 100%"
          range-separator="???"
          start-placeholder="????????????"
          end-placeholder="????????????"
        />
        <br />
        <template #footer>
          <el-button type="primary" @click="createExport" v-text="'??????'" />
        </template>
      </el-dialog>
      <el-dialog v-model="isCheckin" title="????????????/????????????">
        <el-transfer
          v-model="doneMember"
          :titles="['????????????', '????????????']"
          :button-texts="['??????', '??????']"
          :data="waitForChoose"
        />
        <el-button type="primary" @click="editStatusVolunteer(doneMember)">
          ??????
        </el-button>
      </el-dialog>
    </div>
  </transition>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-lighter);
}
.el-table .error-row {
  --el-table-tr-bg-color: var(--el-color-error-lighter);
}
.class-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
