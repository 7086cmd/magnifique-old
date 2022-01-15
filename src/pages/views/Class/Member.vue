<script lang="ts" setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import baseurl from '../../modules/baseurl'

const { t } = useI18n()
const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
let basicnum = ref(0)
;(async () => {
    basicnum.value = (await axios(`${baseurl}transformDate/${gradeid}`)).data.details * 100 + classid
})()
let isSubmiting = ref(false)
let isRegistingMember = ref(false)
let memberifo = reactive({
    name: '',
    number: '',
    in: '',
    type: '',
    description: '',
    plan: '',
    prize: '',
    donow: '',
})
let departments = ref([
    {
        label: '学生会',
        options: [
            {
                label: '纪检部',
                value: 'ji-jian',
            },
            {
                label: '学习部',
                value: 'xue-xi',
            },
            {
                label: '青志部',
                value: 'qing-zhi',
            },
            {
                label: '文体部',
                value: 'wen-ti',
            },
        ],
    },
    {
        label: '团总支',
        options: [
            {
                label: '组织部',
                value: 'zu-zhi',
            },
            {
                label: '宣传部',
                value: 'xuan-chuan',
            },
        ],
    },
])
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
let loading = ref(true)
let membersDetail = ref([])
let preMembersDetail = ref([])
const refresh = () => {
    loading.value = true
    axios({
        url: `${baseurl}class/${gradeid}/${classid}/member/get?password=${password}`,
        method: 'get',
    }).then((response) => {
        loading.value = false
        if (response.data.status == 'ok') {
            membersDetail.value = response.data.details
        }
    })
    axios({
        url: `${baseurl}class/${gradeid}/${classid}/member/pre/get?password=${password}`,
        method: 'get',
    }).then((response) => {
        loading.value = false
        if (response.data.status == 'ok') {
            preMembersDetail.value = response.data.details
        }
    })
}
refresh()
const createRegistry = async () => {
    if (memberifo.name == '') {
        ElMessageBox.alert('没有输入姓名', '失败', {
            type: 'error',
            center: true,
        })
    } else if (parseInt(memberifo.number) <= 0 || parseInt(memberifo.number) >= 100) {
        ElMessageBox.alert('没有输入学号 或者学号输入错误', '失败', {
            type: 'error',
            center: true,
        })
    } else if (memberifo.in == '') {
        ElMessageBox.alert('没有输入想要进入的部门', '失败', {
            type: 'error',
            center: true,
        })
    } else if (memberifo.type == '') {
        ElMessageBox.alert('没有输入想要担任的职务', '失败', {
            type: 'error',
            center: true,
        })
    } else if (memberifo.description == '') {
        ElMessageBox.alert('没有输入个人介绍', '失败', {
            type: 'error',
            center: true,
        })
    } else if (memberifo.plan == '') {
        ElMessageBox.alert('没有输入工作计划', '失败', {
            type: 'error',
            center: true,
        })
    } else {
        isSubmiting.value = true
        const response = await axios({
            url: `${baseurl}class/member/regist`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                member: {
                    name: memberifo.name,
                    number: parseInt(memberifo.number) + basicnum.value * 100,
                    in: memberifo.in,
                    type: memberifo.type,
                    donow: memberifo.donow,
                    description: memberifo.description,
                    prize: memberifo.prize,
                    plan: memberifo.plan,
                },
                password,
                gradeid,
                classid,
            },
            method: 'post',
        })
        isSubmiting.value = false
        if (response.data.status == 'ok') {
            ElMessageBox.alert('注册成功', '成功', {
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
    }
}
</script>
<template>
    <transition name="el-fade-in" appear>
        <div>
            <h4>成员表格</h4>
            <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
                <template #default>
                    <el-card shadow="never">
                        <template #header>
                            <span style="text-align: left">正式成员</span>
                        </template>
                        <el-table :data="membersDetail" highlight-current-row max-height="480px">
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
                        </el-table>
                    </el-card>
                </template>
            </el-skeleton>
            <el-skeleton :loading="loading" animated :rows="10" :throttle="500">
                <template #default>
                    <el-card shadow="never">
                        <template #header>
                            <span style="text-align: left">注册成员</span>
                        </template>
                        <el-table :data="preMembersDetail" highlight-current-row max-height="480px">
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
                                        <el-descriptions-item label="想要进入的部门">
                                            {{ props.row.in }}
                                        </el-descriptions-item>
                                        <el-descriptions-item label="想要担任的职务">
                                            {{ String(props.row.do).replace('undefined', '') }}
                                        </el-descriptions-item>
                                    </el-descriptions>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="姓名" />
                            <el-table-column prop="number" label="学号" />
                            <el-table-column prop="in" label="所属部门" />
                            <el-table-column align="right" fixed="right">
                                <template #header>
                                    <el-button type="text" @click="isRegistingMember = true"> 注册成员 </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </template>
            </el-skeleton>
            <el-dialog v-model="isRegistingMember" title="注册成员" center>
                <template #header>注册成员</template>
                <el-form v-model="memberifo" title="注册成员">
                    <el-form-item label="姓名">
                        <el-input v-model="memberifo.name"></el-input>
                    </el-form-item>
                    <el-form-item label="学号">
                        <el-input v-model="memberifo.number">
                            <template #prepend>{{ basicnum }}</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="加入部门">
                        <el-select v-model="memberifo.in" style="width: 100%">
                            <el-option-group v-for="group in departments" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="担任职位">
                        <el-select v-model="memberifo.type" style="width: 100%">
                            <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="现任职务">
                        <el-input v-model="memberifo.donow"></el-input>
                    </el-form-item>
                    <el-form-item label="自我介绍">
                        <el-input v-model="memberifo.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                    </el-form-item>
                    <el-form-item label="发展计划">
                        <el-input v-model="memberifo.plan" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                    </el-form-item>
                    <el-form-item label="荣获奖项">
                        <el-input v-model="memberifo.prize" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="isRegistingMember = false"> 取消 </el-button>
                        <el-button type="primary" :loading="isSubmiting" @click="createRegistry"> 确定 </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </transition>
</template>

<style>
.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-lighter);
}
.el-table .error-row {
    --el-table-tr-bg-color: var(--el-color-error-lighter);
}
.class-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
