<script lang="ts" setup>
import { ref } from 'vue'
import deduction from './lists/deduction.vue'
import member from './lists/member.vue'
let page = ref('deduction')
</script>
<template>
  <transition name="el-fade-in" appear>
    <div>
      <el-tabs v-model="page" tab-position="left" style="padding-top: 10%">
        <el-tab-pane label="成员" name="member">
          <member />
        </el-tab-pane>
        <el-tab-pane label="扣分" name="deduction">
          <deduction />
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>
