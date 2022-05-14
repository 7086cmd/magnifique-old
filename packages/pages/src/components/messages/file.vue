<!-- @format -->

<script lang="ts" setup>
/* global defineProps */
import type { MessageClient } from "./modules/main";
import { ref, toRefs } from "vue";
import { FileClient } from "./modules/file";
import { lookup } from "./modules/bitmap";
import dayjs from "dayjs";
import { calculateSize } from "./modules/size";
import { Download, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  id: string;
  room: string;
  client: MessageClient;
  msg: string;
  roomperson: Array<{ name: string; id: string }>;
  refresh: (id: string) => Promise<void>;
}>();

const { id, client, room, msg, roomperson, refresh } = toRefs(props);

const fileClient = new FileClient(
  { fileId: id.value, roomId: room.value, messageId: msg.value },
  { username: client.value.userId, password: client.value.password },
  client.value,
  refresh.value
);

// const item = ref(await fileClient.fetch())

const item = ref(fileClient.file);
const ext = ref("");
let upld = ref("");
let align = ref("5%");
let width = ref("40%");
let fname = ref("文件名获取中，请稍后...");
let size = ref("正在获取文件大小...");
fileClient.fetch().then(() => {
  item.value = fileClient.file;
  ext.value = lookup(
    fileClient.file.name.split(".").reverse()[0],
    fileClient.file.mime
  );
  if (fileClient.file.uploader === client.value.userId) {
    align.value = "60%";
    width.value = "80%";
  }
  upld.value = roomperson.value.filter(
    (x) => fileClient.file.uploader === x.id
  )[0].name;
  fname.value = fileClient.file.name;
  size.value = calculateSize(fileClient.file.size);
});
</script>

<template>
  <div :style="('padding-left: ' + align as React.CSSProperties)">
    <el-card :style="('width: ' + width as React.CSSProperties)" shadow="never">
      <template #header>
        <span>
          <el-link :underline="false" style="font-size: 16px" v-text="upld" />
          于
          <span
            style="color: #b1b3b8"
            v-text="dayjs(item.uploadDate).format('YYYY-MM-DD HH:mm:ss')"
          />
          上传
        </span>
      </template>
      <template #default>
        <el-row>
          <el-col :span="3">
            <el-avatar :src="ext" :size="40" />
          </el-col>
          <el-col :span="12">
            {{ fname }}<br />
            <span style="color: #b1b3b8; font-size: 14px" v-text="size" />
          </el-col>
        </el-row>
        <el-button
          type="success"
          round
          plain
          :icon="Download"
          @click="fileClient.download()"
        >
          下载
        </el-button>
        <el-button
          type="danger"
          round
          plain
          :icon="Delete"
          @click="fileClient.delete()"
        >
          删除
        </el-button>
      </template>
    </el-card>
  </div>
</template>
