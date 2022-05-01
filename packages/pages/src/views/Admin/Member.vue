<script setup lang="ts">
/* global member */
import { ref, reactive } from 'vue'
import axios from 'axios'
import { Refresh, Plus, Pointer, Delete, Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import baseurl from '../../modules/baseurl'
import personExample from '../../../examples/person'
import sucfuc from '../../modules/sucfuc'
import failfuc from '../../modules/failfuc'
import FetchingMember from '../../components/lists/fetching-member.vue'
import positions from './positions'
import nProgress from 'nprogress'

nProgress.start()

const { password } = JSON.parse(window.atob(String(localStorage.getItem('adminLoginInfo'))))
let isRegistingMember = ref(false)
let isSubmiting = ref(false)
const information: member = reactive(personExample())
const departments = ref<
  {
    name: string
    value: string
  }[]
>([
  {
    name: '主席团',
    value: '',
  },
])
let types = ref(positions)
let vadmins = ref<
  {
    name: string
    value: string
  }[]
>([])
interface Tree {
  value: string
  label: string
  children?: Tree[]
}
let table = ref<Tree[]>([])
let loading = ref(false)
axios(`${baseurl}department/list`).then(response => {
  departments.value.push(...response.data.details)
})
axios(`${baseurl}power/list`).then(response => {
  vadmins.value.push(...response.data.details)
})
const refresh = async () => {
  nProgress.start()
  loading.value = true
  const response = await axios(`${baseurl}admin/get/all/member?password=${password}`)
  loading.value = false
  if (response.data.status === 'ok') {
    table.value = response.data.details
  }
  nProgress.done()
}
refresh()
const deletePerson = async (number: number) => {
  const response = await axios(`${baseurl}admin/del/member`, {
    data: {
      person: number,
      password,
    },
    method: 'post',
  })
  if (response.data.status === 'ok') {
    sucfuc()
  } else {
    failfuc(response.data.reason, response.data.text)
  }
  refresh()
}
const vioPerson = async (number: number) => {
  const response = await axios(`${baseurl}admin/vio/member`, {
    data: {
      member: number,
      password,
    },
    method: 'post',
  })
  if (response.data.status === 'ok') {
    sucfuc()
  } else {
    failfuc(response.data.reason, response.data.text)
  }
  refresh()
}
let beTheViceMinisterInTheSameTime = ref(false)
const createMember = async () => {
  isSubmiting.value = true
  const createMsg = (msg: string) => {
    ElMessageBox.alert(msg, '失败', {
      center: true,
      type: 'error',
    })
  }
  if (information.number >= 21000000 || information.number <= 20000000) {
    createMsg('不正确的号码')
  } else if (information.name === '') {
    createMsg('不正确的姓名')
  } else if (information.union.department === '' && !information.union.position.includes('chairman')) {
    createMsg('不正确的部门')
  } else if (information.union.position === 'none') {
    createMsg('不正确的职位')
  } else if (information.union.position === 'vice-chairman' && information.union.admin.length === 0) {
    createMsg('不正确的职位')
  } else {
    try {
      information.union.duty = (await axios(`${baseurl}department/${information.union.department}/duty`)).data.details as ('deduction' | 'post' | 'radio' | 'volunteer')[]
    } catch (_e) {
      information.union.duty = []
    }
    if (information.union.duty === undefined) {
      information.union.duty = []
    }
    information.union.leader = information.union.position.includes('chairman') || information.union.position === 'minister'
    if (information.union.position === 'minister') {
      information.union.admin = [...information.union.duty, 'member']
    }
    if (information.union.position === 'chairman') {
      information.union.admin = ['deduction', 'post', 'radio', 'volunteer']
    }
    if (beTheViceMinisterInTheSameTime.value) {
      information.union.admin.push('member-volunteer')
    }
    const response = await axios(`${baseurl}admin/new/member`, {
      data: {
        member: information,
        password,
      },
      method: 'post',
    })
    if (response.data.status === 'ok') {
      sucfuc()
    } else {
      failfuc(response.data.reason, response.data.text)
    }
    information.name = ''
    information.number = 0
    information.union.duty = []
    information.union.admin = []
    information.union.department = ''
    information.union.position = 'clerk'
    isSubmiting.value = false
    refresh()
  }
}
const useMember = ref(0)
const isShowingModel = ref(false)
const openDialog = (num: string) => {
  useMember.value = Number(num)
  if (isNaN(useMember.value)) {
    useMember.value = 0
  } else isShowingModel.value = true
}
const delay = () => setTimeout(() => (useMember.value = 0), 1000)
</script>

<template>
  <div @click="delay">
    <el-drawer v-model="isShowingModel" direction="rtl" size="60%" :destroy-on-close="true">
      <fetching-member :number="useMember" />
      <el-divider />
      <el-tooltip content="删除成员" placement="bottom" effect="light">
        <el-popconfirm title="确定要删除成员吗？" @confirm="deletePerson(useMember)">
          <template #reference>
            <el-button type="danger" round plain>
              <el-icon><delete /></el-icon>删除成员
            </el-button>
          </template>
        </el-popconfirm>
      </el-tooltip>
      <el-tooltip content="通报批评" placement="bottom" effect="light">
        <el-popconfirm title="确定要删除15分的素质分吗？" @confirm="vioPerson(useMember)">
          <template #reference>
            <el-button type="warning" round plain>
              <el-icon><pointer /></el-icon>通报批评（删除15分素质分）
            </el-button>
          </template>
        </el-popconfirm>
      </el-tooltip>
    </el-drawer>
    <el-card>
      <template #default>
        <el-tooltip content="刷新内容" placement="bottom" effect="light">
          <el-button type="success" circle plain :icon="Refresh" @click="refresh" />
        </el-tooltip>
        <el-tooltip :content="isRegistingMember ? '关闭添加成员' : '添加成员'" placement="bottom" effect="light">
          <el-button :type="isRegistingMember ? 'danger' : 'primary'" circle plain :icon="isRegistingMember ? Close : Plus" @click="isRegistingMember = !isRegistingMember" />
        </el-tooltip>
        <el-divider />

        <el-collapse-transition>
          <el-form v-if="isRegistingMember" v-model="information" title="注册成员">
            <el-form-item label="姓名">
              <el-input v-model="information.name" />
            </el-form-item>
            <el-form-item label="学号">
              <el-input v-model="information.number" />
            </el-form-item>
            <el-form-item label="加入部门">
              <el-select v-model="information.union.department" style="width: 100%">
                <el-option v-for="item in departments" :key="item.value" :label="item.name" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="担任职位">
              <el-select v-model="information.union.position" style="width: 100%">
                <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="information.union.position === 'vice-chairman'" label="管理权力">
              <el-select v-model="information.union.admin" multiple collapse-tags style="width: 100%">
                <el-option v-for="item in vadmins" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <el-checkbox v-if="information.union.department !== ''" v-model="beTheViceMinisterInTheSameTime" label="在部门内同时担任副部长职务"></el-checkbox>
            </el-form-item>
            <el-button round @click="isRegistingMember = false"> 取消 </el-button>
            <el-button round type="primary" :loading="isSubmiting" @click="createMember"> 确定 </el-button>
          </el-form>
        </el-collapse-transition>

        <el-collapse-transition>
          <el-tree v-if="!isRegistingMember" :data="table" draggable>
            <template #default="{ node }">
              <el-link :underline="false" type="default" @click="openDialog(node.data.value)">{{ node.label }}</el-link>
            </template>
          </el-tree>
        </el-collapse-transition>
      </template>
    </el-card>
  </div>
</template>
