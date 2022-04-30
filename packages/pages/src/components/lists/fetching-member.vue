<script lang="ts" setup>
/* global defineProps, member_processed */
import { toRefs, ref } from 'vue'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import Desc from './MemberDescription.vue'
const props = defineProps<{ number: number }>()
const fetched = ref(false)
const { number } = toRefs(props)
const info = ref<member_processed>()
axios(baseurl + 'member/getinfo/' + (number?.value as number)).then(response => {
  info.value = response.data.details
  fetched.value = true
})
</script>
<template>
  <Desc v-if="fetched" :data="info"></Desc>
</template>
