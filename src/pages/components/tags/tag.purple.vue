<script lang="ts" setup>
import { defineProps, toRefs } from 'vue'
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  text: Number,
})
const { text } = toRefs(props)
</script>
<template>
  <el-tag style="--el-tag-text-color: #626aef; --el-tag-bg-color: rgb(239, 240, 253)">{{ text }}</el-tag>
</template>
