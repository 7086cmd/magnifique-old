<script setup lang="ts">
/* eslint-disable vue/no-v-html */
// import './style.css'
import { createMarkdownParser } from './parser'
import { defineProps, ref, toRefs, watch } from 'vue'
import { ElLoading } from 'element-plus'
import Prismjs from 'prismjs'
// import style from './style.css'

const props = defineProps<{
  content: string
}>()

let { content } = toRefs(props)

let context = ref('')

const loader = ElLoading.service({
  text: '消息正在加载中，请稍后',
})
context.value = createMarkdownParser(content.value)
Prismjs.highlightAll(false)
loader.close()

watch(content, () => {
  const loader = ElLoading.service({
    text: '消息正在加载中，请稍后',
  })
  context.value = createMarkdownParser(content.value)
  Prismjs.highlightAll(false)
  loader.close()
})

import.meta.hot?.on('vite:beforeUpdate', () => {
  console.log('event')
  Prismjs.highlightAll(false)
})
</script>

<template>
  <fragment>
    <div className="markdown" v-html="context"></div>
  </fragment>
</template>

<style scoped>
/* @import url('./style.css'); */
.markdown {
  src: url('./style.css');
}
</style>
