<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import baseurl from '../../modules/baseurl'

const { password } = JSON.parse(window.atob(String(localStorage.getItem('adminLoginInfo'))))
let isRegistingMember = ref(false)
let isSubmiting = ref(false)
const information = reactive({
    number: 0,
    name: '',
    in: '',
    type: '',
})
let departments = ref([
    {
        label: '整体',
        options: [
            {
                label: '主席团',
                value: 'chair-man',
            },
        ],
    },
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
    {
        name: '部长',
        value: 'bu-zhang',
    },
    {
        name: '副主席',
        value: 'fu-zhu-xi',
    },
    {
        name: '主席',
        value: 'zhu-xi',
    },
])
let vadmins = ref([
    {
        label: '团总支',
        value: 'tuan-zong-zhi',
    },
    {
        label: '青体',
        value: 'qing-ti',
    },
    {
        label: '学检',
        value: 'xue-jian',
    },
])
let vadmin = ref('')
const { t } = useI18n()
let search = ref('')
let choice = ref('all')
let table = ref([])
let loading = ref(false)
const panes = ref([
    {
        label: '全部',
        value: 'all',
    },
    {
        label: '骨干',
        value: 'core',
    },
    {
        label: '学习部',
        value: 'xue-xi',
    },
    {
        label: '纪检部',
        value: 'ji-jian',
    },
    {
        label: '青志部',
        value: 'qing-zhi',
    },
    {
        label: '文体部',
        value: 'wen-ti',
    },
    {
        label: '宣传部',
        value: 'xuan-chuan',
    },
    {
        label: '组织部',
        value: 'zu-zhi',
    },
])
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
        if (information.type == 'fu-zhu-xi') {
            detail['vadmin'] = vadmin.value
        }
        const response = await axios(`${baseurl}admin/new/member`, {
            data: {
                member: detail,
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
        refresh(choice.value)
    }
}
</script>

<template>
    <div>
        <h4>成员管理</h4>
        <el-tabs v-model="choice" tab-position="left">
            <el-tab-pane v-for="item in panes" :key="item.value" :label="item.label" :name="item.value">
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
                    <el-select v-model="information.in" style="width: 100%">
                        <el-option-group v-for="group in departments" :key="group.label" :label="group.label">
                            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="担任职位">
                    <el-select v-model="information.type" style="width: 100%">
                        <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="information.type == 'fu-zhu-xi'" label="细则">
                    <el-select v-model="vadmin" style="width: 100%">
                        <el-option v-for="item in vadmins" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
