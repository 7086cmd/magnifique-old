<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import controls from '../components/controls.vue'
const router = useRouter()
const { t } = useI18n()

const list = [
  {
    param: 'class',
    name: t('home.class'),
  },
  {
    param: 'member',
    name: t('home.member'),
  },
  {
    param: 'admin',
    name: t('home.admin'),
  },
]
const toTag = (param: string) => {
  router.push('/' + param + '/')
}
</script>

<template>
  <div>
    <el-container>
      <el-header style="text-align: right">
        <controls />
      </el-header>
      <el-container>
        <el-aside width="5%"></el-aside>
        <el-main>
          <div class="row">
            <div class="col-2"></div>
            <div class="col">
              <h2>{{ t('home.login') }}</h2>
              <div v-for="i in list" :key="i.param"><br /><br /><el-button style="width: 100%" @click="toTag(i.param)" v-text="i.name"></el-button></div>
            </div>
            <div class="col-2"></div>
          </div>
        </el-main>
        <el-aside width="5%"> </el-aside>
      </el-container>
    </el-container>
  </div>
</template>
