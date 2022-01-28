<script setup lang="ts">
/* global member */
import { ref, reactive, watch, Ref } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import baseurl from '../../modules/baseurl'
import personExample from '../../../examples/person'

const { password } = JSON.parse(window.atob(String(localStorage.getItem('adminLoginInfo'))))
let isRegistingMember = ref(false)
let isSubmiting = ref(false)
const information: member = reactive(personExample())
const departments: Ref<
  {
    name: string
    value: string
  }[]
> = ref([
  {
    name: '主席团',
    value: '',
  },
])
let types = ref([
  {
    name: '干事',
    value: 'clerk',
  },
  {
    name: '副部长',
    value: 'vice-minister',
  },
  {
    name: '部长',
    value: 'minister',
  },
  {
    name: '副主席',
    value: 'vice-chairman',
  },
  {
    name: '主席',
    value: 'chairman',
  },
])
let vadmins = ref<
  {
    name: string
    value: string
  }[]
>([])
const { t } = useI18n()
let search = ref('')
let choice = ref('all')
let table = ref([])
let loading = ref(false)
const panes: Ref<
  {
    name: string
    value: string
  }[]
> = ref([
  {
    name: '全部',
    value: 'all',
  },
  {
    name: '核心成员',
    value: 'core',
  },
])
axios(`${baseurl}department/list`).then((response) => {
  departments.value.push(...response.data.details)
  panes.value.push(...response.data.details)
})
axios(`${baseurl}power/list`).then((response) => {
  vadmins.value.push(...response.data.details)
})
const refresh = async (type: string) => {
  loading.value = true
  const response = await axios(`${baseurl}admin/get/${type}/member?password=${password}`, {
    method: 'get',
  })
  loading.value = false
  if (response.data.status == 'ok') {
    table.value = response.data.details
  }
}
refresh('all')
watch(choice, () => {
  refresh(choice.value)
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deletePerson = async (props: any) => {
  const response = await axios(`${baseurl}admin/del/member`, {
    data: {
      person: props.row.number,
      password,
    },
    method: 'post',
  })
  if (response.data.status == 'ok') {
    ElMessageBox.alert('删除成功', '提示', {
      type: 'success',
      center: true,
    })
  } else {
    ElMessageBox.alert(
      t('dialogs.' + response.data.reason, {
        msg: response.data.text,
      }),
      '失败',
      {
        type: 'error',
        center: true,
      }
    )
  }
  refresh(choice.value)
}
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
  } else if (information.name == '') {
    createMsg('不正确的姓名')
  } else if (information.union.department == '' && !information.union.position.includes('chairman')) {
    createMsg('不正确的部门')
  } else if (information.union.position == 'none') {
    createMsg('不正确的职位')
  } else if (information.union.position == 'vice-chairman' && information.union.admin.length === 0) {
    createMsg('不正确的职位')
  } else {
    try {
      information.union.duty = (await axios(`${baseurl}department/${information.union.department}/duty`)).data.details as ('deduction' | 'document' | 'radio' | 'volunteer')[]
    } catch (_e) {
      information.union.duty = []
    }
    information.union.leader = information.union.position.includes('chairman') || information.union.position === 'minister'
    const response = await axios(`${baseurl}admin/new/member`, {
      data: {
        member: information,
        password,
      },
      method: 'post',
    })
    if (response.data.status == 'ok') {
      ElMessageBox.alert('注册成功', '成功', {
        center: true,
        type: 'success',
      })
    } else {
      ElMessageBox.alert(
        t('dialogs.' + response.data.reason, {
          msg: response.data.text,
        }),
        '失败',
        {
          type: 'error',
          center: true,
        }
      )
    }
    information.name = ''
    information.number = ''
    information.union.duty = []
    information.union.admin = []
    information.department = ''
    information.position = 'clerk'
    isSubmiting.value = false
    refresh(choice.value)
  }
}
</script>

<template>
  <div>
    <h4>成员管理</h4>
    <el-tabs v-model="choice" tab-position="left">
      <el-tab-pane v-for="item in panes" :key="item.value" :label="item.name" :name="item.value">
        <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
          <template #default>
            <el-card shadow="never">
              <template #header>
                <el-button type="text" @click="isRegistingMember = true"> 添加成员 </el-button>
              </template>
              <el-table
                :data="table.filter((data: any) => !search || data.number.toLowerCase().includes(search.toLowerCase()) || String(data.person).toLowerCase().includes(search.toLowerCase()))"
                highlight-current-row
                max-height="480px"
              >
                <el-table-column type="expand">
                  <template #header>
                    <el-button type="text" :icon="Refresh" @click="refresh(choice)" />
                  </template>
                  <template #default="props">
                    <el-descriptions :title="'成员' + props.row.number + '信息'" border>
                      {{ console.log(props.row) }}
                      <el-descriptions-item label="姓名">
                        {{ props.row.name }}
                      </el-descriptions-item>
                      <el-descriptions-item label="学号">
                        {{ props.row.number }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所属部门">
                        {{ props.row.in }}
                      </el-descriptions-item>
                      <!-- <el-descriptions-item label="职务">
                        {{ props.row.duty.join('、') }}
                      </el-descriptions-item>
                      <el-descriptions-item label="管理">
                        {{ props.row.admin.join('、') }}
                      </el-descriptions-item> -->
                      <el-descriptions-item label="是否为主席团成员">
                        {{ props.row.icg ? '是' : '不是' }}
                      </el-descriptions-item>
                      <el-descriptions-item label="素质分">
                        {{ props.row.record.score }}
                      </el-descriptions-item>
                      <el-descriptions-item label="违纪次数">
                        {{ props.row.record.violation }}
                      </el-descriptions-item>
                      <el-descriptions-item label="反馈次数">
                        {{ props.row.record.actions }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="number" label="学号" />
                <el-table-column prop="in" label="所属部门" />
                <el-table-column align="right" fixed="right">
                  <template #header>
                    <el-input v-model="search" size="mini" placeholder="输入以搜索" />
                  </template>
                  <template #default="props">
                    <el-button size="small" type="text" @click="deletePerson(props)"> 删除成员 </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
        </el-skeleton>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="isRegistingMember" title="注册成员" center>
      <template #header>注册成员</template>
      <el-form v-model="information" title="注册成员">
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
        <el-form-item v-if="information.union.position == 'vice-chairman'" label="管理权力">
          <el-select v-model="information.union.admin" multiple collapse-tags style="width: 100%">
            <el-option v-for="item in vadmins" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isRegistingMember = false"> 取消 </el-button>
          <el-button type="primary" :loading="isSubmiting" @click="createMember"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
