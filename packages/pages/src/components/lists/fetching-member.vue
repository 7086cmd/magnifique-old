<script lang="ts" setup>
/* global defineProps, member_processed */
import { toRefs, ref } from 'vue'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import Desc from './MemberDescription.vue'
const props = defineProps<{ number: number; useTag: boolean }>()
const fetched = ref(false)
const { number, useTag } = toRefs(props)
const info = ref<member_processed>()
const isOk = ref(true)
const openIt = ref(false)
axios(baseurl + 'member/getinfo/' + (number?.value as number)).then(response => {
  if (response.data.status === 'ok') {
    info.value = response.data.details
    isOk.value = true
  } else isOk.value = false
  fetched.value = true
})
</script>
<template>
  <div>
    <el-skeleton :loading="!fetched" animated>
      <template #template>
        <el-skeleton-item variant="text" style="width: 4em" />
      </template>
      <template #default>
        <div v-if="useTag" @click="openIt = true">
          <el-tag v-if="isOk && fetched" type="success">{{ info?.name }}</el-tag>
          <el-tag v-else-if="fetched" type="error">{{ number }}</el-tag>
        </div>
        <div v-else @click="openIt = true">
          <el-link v-if="isOk && fetched" :underline="false">{{ info?.name }}</el-link>
          <el-link v-else-if="fetched" :underline="false" type="error">{{ number }}</el-link>
        </div>
      </template>
    </el-skeleton>
    <teleport to="body">
      <el-dialog v-model="openIt" :title="info ? info.name : number" width="60%" :modal="false" draggable>
        <div>
          <el-card shadow="never">
            <template #default>
              <Desc v-if="fetched && isOk" :data="info"></Desc>
              <el-result v-else-if="fetched && !isOk" icon="error" title="不存在此人" sub-title="“村中闻有此人，咸来问讯。”"></el-result>
            </template>
          </el-card>
        </div>
      </el-dialog>
    </teleport>
  </div>
</template>
