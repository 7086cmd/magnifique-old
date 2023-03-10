<!-- @format -->

<script lang="ts" setup>
/* global defineProps, MessageItem */
import { readMarkdown, renderMarkdownInline } from "./modules/ril";
import { toRefs, ref, h } from "vue";
import type { MessageClient } from "./modules/main";
import { ElMessage, ElMessageBox } from "element-plus";
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  content: MessageItem;
  username: string;
  client: MessageClient;
  roomId: string;
  rfmethod: (param: string) => Promise<void>;
}>();

const { content, username, client, roomId, rfmethod } = toRefs(props);

const val = ref(renderMarkdownInline(content.value.content));

const clipboard = useClipboard();

const menus = ref({
  menus: [
    {
      label: "撤回",
      tip: "撤回消息",
      // icon: Delete,
      click() {
        ElMessageBox.confirm(
          h("span", ["确定删除消息吗？", h("strong", "删除后无法恢复！")]),
          "Think Twice, Delete Once!",
          {
            type: "warning",
            center: true,
            roundButton: true,
            cancelButtonText: "算了吧",
            confirmButtonText: "确定",
          }
        ).then(async () => {
          await client.value.deleteMessage(roomId.value, content.value.id);
          await rfmethod.value(roomId.value);
        });
        return true;
      },
    },
    {
      label: "关闭",
      tip: "关闭菜单",
      click() {
        return true;
      },
    },
    {
      label: "朗读",
      tip: "朗读这些文字",
      click() {
        readMarkdown(content.value.content);
      },
    },
    {
      label: "复制文字",
      tip: "文字长度: " + content.value.content.length,
      click() {
        clipboard.copy(content.value.content);
        ElMessage({
          message: "复制成功，内容：" + content.value.content,
          type: "success",
        });
      },
    },
  ],
  zIndex: 9999,
});
</script>

<template>
  <div>
    <div
      v-if="content.creator === username"
      id="msg"
      v-menus:right="menus"
      style="text-align: right"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span id="msgi" style="background-color: #ecf5ff" v-html="val"></span>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-else id="msg" style="text-align: left">
      <span id="msgi" style="background-color: #f4f4f5" v-html="val"></span>
    </div>
  </div>
</template>

<style scoped>
#msg {
  border-radius: 8px;
  font-size: 18px;
  width: auto;
}
#msgi {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
}
</style>
