<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
document.title = t('title')
</script>

<template>
  <router-view></router-view>
</template>
