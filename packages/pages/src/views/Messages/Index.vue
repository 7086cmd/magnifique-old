<script lang="ts" setup>
/* global MessageItem */
import { ref, defineProps, toRefs } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { MessageClient } from '../../components/messages/modules/main'
import NProgress from 'nprogress'

const props = defineProps<{
  username: string
  password: string
}>()

const { username, password } = toRefs(props)

const client = new MessageClient(username.value, password.value)

const items = ref<
  {
    title: string
    id: string
    recent: string
  }[]
>([])
const msgs = ref<MessageItem[]>([])

const refresh = async () => {
  NProgress.start()
  items.value = await client.getLatestRooms()
  NProgress.done()
}

const getRoomMsg = async (roomId: string) => {
  NProgress.start()
  msgs.value = await client.getRoomMessages(roomId)
  NProgress.done(true)
}

refresh()

let searcher = ref('')
</script>

<template>
  <div>
    <el-input v-model="searcher" size="large" placeholder="输入以检索" :prefix-icon="Search"></el-input>
    <el-scrollbar max-height="720px">
      <el-divider />
      <div v-for="item in items" :key="item.id">
        <div v-if="item.title.includes(searcher)">
          <el-tooltip :content="'聊天组编号：' + item.id" placement="right" effect="light">
            <el-link :underline="false" style="font-size: 20px" @click="getRoomMsg(item.id)">{{ item.title }}</el-link>
          </el-tooltip>

          <br />
          <span style="color: gray">{{ item.recent }}</span>
          <el-divider border-style="dashed" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
