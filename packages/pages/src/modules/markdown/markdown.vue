<script setup lang="ts">
/* eslint-disable vue/no-v-html */
// import './style.css'
import { createMarkdownParser } from './parser'
import { defineProps, ref, toRefs, watch } from 'vue'
import Prismjs from 'prismjs'
// import style from './style.css'
Prismjs.manual = true
const props = defineProps<{
  content: string
}>()

let { content } = toRefs(props)

let context = ref('')

context.value = createMarkdownParser(content.value)
Prismjs.highlightAll(false)
document.querySelectorAll('pre code').forEach(block => Prismjs.highlightElement(block))
watch(content, () => {
  context.value = createMarkdownParser(content.value)
  Prismjs.highlightAll(false)
  document.querySelectorAll('pre code').forEach(block => Prismjs.highlightElement(block))
})

import.meta.hot?.on('vite:beforeUpdate', () => {
  Prismjs.highlightAll(false)
})
</script>

<template>
  <div v-html="context"></div>
</template>

<style src="./style.css"></style>
