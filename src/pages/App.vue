<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
document.title = t('title')
</script>

<template lang="pug">
router-view
</template>
