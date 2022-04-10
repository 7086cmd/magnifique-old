<script lang="ts" setup>
/* global defineProps */
import type { MessageClient } from './modules/main'
import { toRefs } from 'vue'

const props = defineProps<{
  id: string
  client: MessageClient
}>()

const { id, client } = toRefs(props)

const content = await client.value.fileCenter.getContent(id.value)

console.log(content)
</script>
