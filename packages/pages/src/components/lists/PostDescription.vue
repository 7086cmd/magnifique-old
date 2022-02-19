<script setup lang="ts">
/* global PostList */
import { defineProps, ref, toRefs, unref } from 'vue'

const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  data: Object,
})

const { data } = toRefs(props)

const detail = ref(unref(data) as PostList)
</script>

<template>
  <div>
    <p>体裁： <el-tag v-text="detail.type"></el-tag></p>
    <p v-text="detail.description"></p>
  </div>
</template>
