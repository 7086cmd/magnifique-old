<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, reactive, Ref } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import { ElLoading, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import baseurl from '../../../modules/baseurl'
const router = useRouter()
const { password, number } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
let vadmin = ref('')
const { t } = useI18n()
let search = ref('')
let choice = ref('member')
let table = ref([])
let loading = ref(false)
let isRegistingMember = ref(false)
let isSubmiting = ref(false)
let me: Ref<any> = ref()
const information = reactive({
  number: 0,
  name: '',
  in: '',
  type: '',
})
let data = reactive({
  deduction: [],
})
const departmentlist = ref({
  纪检部: 'ji-jian',
  学习部: 'xue-xi',
  青志部: 'qing-zhi',
  文体部: 'wen-ti',
  宣传部: 'xuan-chuan',
  组织部: 'zu-zhi',
})
const fbstatus = {
  normal: '未申诉',
  processing: '未处理',
  failed: '申诉失败',
}
const tableRowClassName = (props: any) => {
  const statuses = {
    processing: 'warning-row',
    failed: 'error-row',
    normal: '',
  }
  return statuses[props.row.status]
}
const refresh2 = async (content: string) => {
  loading.value = true
  data[content] = (
    await axios(`${baseurl}member/admin/${number}/get/all/${content}?password=${password}`, {
      method: 'get',
    })
  ).data.details
  for (let i = 0; i in data[content]; i++) {
    data[content][i].time = dayjs(data[content][i].time).format('YYYY/MM/DD')
  }
  loading.value = false
}
const deleteDeduction = async (props: any) => {
  const delLoad = ElLoading.service({
    text: '正在删除扣分，请稍后',
  })
  const response = await axios({
    url: `${baseurl}member/jjb/${number}/work/del/deduction`,
    method: 'post',
    data: {
      id: props.row.id,
      password,
      person: props.row.person,
    },
  })
  delLoad.close()
  if (response.data.status == 'ok') {
    ElMessageBox.alert('操作成功', '成功', {
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
  refresh2('deduction')
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let key: any, _val: any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
for ([key, _val] of Object.entries(data)) {
  refresh2(key)
}
// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  me.value = (await axios(`${baseurl}member/getinfo/${number}`)).data.details
  if (me.value.do.split('').reverse()[0] == '事') {
    router.push('/member/')
    ElMessageBox.alert('没有管理权限', '访问受限', {
      center: true,
      type: 'error',
    })
  }

  information.in = departmentlist.value[me.value.in]
  loading.value = true
  const response = await axios(`${baseurl}member/admin/${number}/get/${departmentlist.value[me.value.in]}/member?password=${password}`, {
    method: 'get',
  })
  loading.value = false
  if (response.data.status == 'ok') {
    table.value = response.data.details
  }
})()
const refresh = async () => {
  loading.value = true
  const response = await axios(`${baseurl}member/admin/${number}/get/${departmentlist.value[me.value.in]}/member?password=${password}`, {
    method: 'get',
  })
  loading.value = false
  if (response.data.status == 'ok') {
    table.value = response.data.details
  }
}
let types = ref([
  {
    name: '干事',
    value: 'gan-shi',
  },
  {
    name: '副部长',
    value: 'fu-bu-zhang',
  },
])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deletePerson = async (props: any) => {
  const response = await axios(`${baseurl}member/admin/del/member`, {
    data: {
      person: props.row.number,
      password,
      number,
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
  refresh()
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
  } else if (information.in == '') {
    createMsg('不正确的部门')
  } else if (information.type == '') {
    createMsg('不正确的职位')
  } else if (information.type == 'fu-zhu-xi' && vadmin.value == '') {
    createMsg('不正确的职位')
  } else {
    const detail = {
      name: information.name,
      number: information.number,
      in: information.in,
      type: information.type,
    }
    const response = await axios(`${baseurl}member/admin/new/member`, {
      data: {
        member: detail,
        number,
        password,
      },
      method: 'post',
    })
    isSubmiting.value = false
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
    refresh()
  }
}
</script>

<template>
  <div>
    <h4>成员管理</h4>
    <el-tabs v-model="choice" tab-position="left">
      <el-tab-pane label="成员管理" name="member">
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
                    <el-button type="text" :icon="Refresh" @click="refresh()" />
                  </template>
                  <template #default="props">
                    <el-descriptions :title="'成员' + props.row.number + '信息'" border>
                      <el-descriptions-item label="姓名">
                        {{ props.row.name }}
                      </el-descriptions-item>
                      <el-descriptions-item label="学号">
                        {{ props.row.number }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所属部门">
                        {{ props.row.in }}
                      </el-descriptions-item>
                      <el-descriptions-item label="职务">
                        {{ String(props.row.do).replace('undefined', '') }}
                      </el-descriptions-item>
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
                    <el-button size="small" type="text" :disabled="!(me.do.split('').reverse()[0] == '长' && me.do.split('').reverse()[2] == '部')" @click="deletePerson(props)"> 删除成员 </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
        </el-skeleton>
      </el-tab-pane>
      <el-tab-pane id="deduc" label="扣分数据" name="deduction">
        <el-card shadow="never">
          <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
            <template #default>
              <el-card shadow="never">
                <el-table
                  :data="data.deduction.filter((data: any) => !search || data.reason.toLowerCase().includes(search.toLowerCase()) || String(data.person).toLowerCase().includes(search.toLowerCase()) || String(data.deduction).toLowerCase().includes(search.toLowerCase()) || String(data.time).toLowerCase().includes(search.toLowerCase()))"
                  highlight-current-row
                  max-height="480px"
                  :default-sort="{
                    prop: 'deduction',
                    order: 'descending',
                  }"
                  :row-class-name="tableRowClassName"
                >
                  <el-table-column type="expand">
                    <template #header>
                      <el-button type="text" :icon="Refresh" @click="refresh2('deduction')"></el-button>
                    </template>
                    <template #default="props">
                      <el-alert title="提醒：这不是Bug哦，这个真的是扣分编号" type="info" center></el-alert>
                      <el-descriptions :title="`扣分${props.row.id}信息`" border>
                        <el-descriptions-item label="违纪者">
                          {{ props.row.person }}
                        </el-descriptions-item>
                        <el-descriptions-item label="扣分数">
                          {{ props.row.deduction }}
                        </el-descriptions-item>
                        <el-descriptions-item label="原因">
                          {{ props.row.reason }}
                        </el-descriptions-item>
                        <el-descriptions-item label="地点">
                          {{ props.row.place }}
                        </el-descriptions-item>
                        <el-descriptions-item label="时间">
                          {{ props.row.time }}
                        </el-descriptions-item>
                        <el-descriptions-item label="扣分者">
                          {{ props.row.deductor.name }}
                        </el-descriptions-item>
                        <el-descriptions-item label="解释说明">
                          {{ props.row.description }}
                        </el-descriptions-item>
                        <el-descriptions-item label="申诉状态">
                          {{ fbstatus[props.row.status] }}
                        </el-descriptions-item>
                      </el-descriptions>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="id" label="扣分ID" /> -->
                  <el-table-column prop="person" label="违纪者" />
                  <el-table-column prop="deduction" label="扣分数" />
                  <el-table-column prop="reason" label="原因" />
                  <el-table-column prop="time" label="时间" />
                  <el-table-column prop="deductor.name" label="扣分者" />
                  <el-table-column align="right" fixed="right">
                    <template #header>
                      <el-input v-model="search" size="mini" placeholder="输入以搜索" />
                    </template>
                    <template #default="props">
                      <el-button type="text" size="small" @click="deleteDeduction(props)"> 删除 </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </template>
          </el-skeleton>
        </el-card>
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
        <el-form-item label="担任职位">
          <el-select v-model="information.type" style="width: 100%">
            <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
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
