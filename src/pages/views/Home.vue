<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Close, Minus, Plus } from '@element-plus/icons-vue'
const router = useRouter()
const { t } = useI18n()

let isClient = ref(false)

try {
  if (window.magnifique.isElectron === true) {
    isClient.value = true
  }
  // eslint-disable-next-line no-empty
} catch (_e) {}

const closeServer = () => {
  window.magnifique.closeServer()
}
const minServerWindow = () => {
  window.magnifique.minServerWindow()
}
const maxServerWindow = () => {
  window.magnifique.maxServerWindow()
}

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
        <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()"> </el-button>
        <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()"> </el-button>
        <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()"> </el-button>
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
