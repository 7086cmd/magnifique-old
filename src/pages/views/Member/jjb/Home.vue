<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ref, reactive, watch, Ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { ElMessageBox, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import baseurl from '../../../modules/baseurl'

const { t } = useI18n()

let choice = ref('deduction')

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))

let deductionData = reactive({
    person: 0,
    reason: '',
    description: '',
    deduction: 0,
    deductor: {
        name: '',
        number,
    },
    time: dayjs().format('YYYY/MM/DD HH:mm:ss'),
    place: '',
    status: 'normal',
    msgs: {
        feedback: '',
        turndown: '',
    },
})
let typs: Ref<string[]> = ref([])
let typicals: Ref<any[]> = ref([])
let dets: Ref<any> = ref({})
;(async () => {
    deductionData.deductor.name = (await axios(`${baseurl}member/getinfo/${number}`)).data.details.name
    typicals.value = (await axios(`${baseurl}types`)).data.details
    dets.value = (await axios(`${baseurl}decdetails`)).data.details
})()
watch(typs, () => {
    let dtotal = 0
    for (let i = 0; i in typs.value; i++) {
        dtotal = Math.floor((dtotal + dets.value[typs.value[i]]) * 100) / 100
    }
    deductionData.deduction = dtotal
})
let isFetchingData = ref(false)
let newDeduction = ref(false)
let isCreating = ref(false)
let allData: Ref<any[]> = ref([])
const fbstatus = {
    normal: '未申诉',
    processing: '未处理',
    failed: '申诉失败',
}
const tableRowClassName = (scope: any) => {
    const statuses = {
        processing: 'warning-row',
        failed: 'success-row',
        normal: '',
    }
    return statuses[scope.row.status]
}
const refresh = async () => {
    isFetchingData.value = true
    const response = await axios({
        url: `${baseurl}member/jjb/${number}/work/get/deduction?password=${password}`,
        method: 'get',
    })
    isFetchingData.value = false
    if (response.data.status == 'ok') {
        allData.value = response.data.details
        for (let i = 0; i in allData.value; i++) {
            allData.value[i].time = dayjs(allData.value[i].time).format('YYYY/MM/DD HH:mm:ss')
            allData.value[i]['personnum'] = allData.value[i].person
        }
    }
}
const turnDown = async (props: any) => {
    ElMessageBox.prompt('驳回原因', '驳回', {
        type: 'warning',
        center: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        inputType: 'textarea',
    }).then(async (result) => {
        const delLoad = ElLoading.service({
            text: '正在驳回，请稍后',
        })
        const response = await axios({
            url: `${baseurl}member/jjb/${number}/work/turnd/deduction`,
            method: 'post',
            data: {
                id: props.row.id,
                password,
                person: props.row.personnum,
                reason: result.value,
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
        refresh()
    })
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
            person: props.row.personnum,
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
    refresh()
}
refresh()
const submitDeduction = async () => {
    let allSuccess = true
    let msgs: string[] = []
    const ded = async () => {
        if (deductionData.person >= 21000000 || deductionData.person <= 10000000) {
            ElMessageBox.alert('学号错误', '失败', {
                type: 'error',
                center: true,
            })
        } else if (typs.value.length == 0) {
            ElMessageBox.alert('类型错误', '失败', {
                type: 'error',
                center: true,
            })
        } else if (deductionData.place == '') {
            ElMessageBox.alert('地点错误', '失败', {
                type: 'error',
                center: true,
            })
        } else if (!dayjs(deductionData.time).isValid()) {
            ElMessageBox.alert('日期不正确', '失败', {
                type: 'error',
                center: true,
            })
        } else {
            isCreating.value = true
            for (let i = 0; i in typs.value; i++) {
                let data = deductionData
                data.reason = typs.value[i]
                data.deduction = dets.value[typs.value[i]]
                const response = await axios({
                    url: `${baseurl}member/jjb/${number}/work/new/deduction`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        id: number,
                        password,
                        content: data,
                    },
                    method: 'post',
                })
                isCreating.value = false
                if (response.data.status !== 'ok') {
                    allSuccess = false
                    msgs.push(
                        t('dialogs.' + response.data.reason, {
                            msg: response.data.text,
                        })
                    )
                }
            }
            if (allSuccess) {
                ElMessageBox.alert('操作成功', '成功', {
                    type: 'success',
                    center: true,
                })
            } else {
                ElMessageBox.alert(Array.from(new Set(msgs)).join('<br>'), '失败', {
                    type: 'error',
                    center: true,
                    dangerouslyUseHTMLString: true,
                })
            }
            deductionData.person = 0
            deductionData.reason = ''
            deductionData.description = ''
            deductionData.deduction = 0
            deductionData.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
            deductionData.place = ''
            typs.value = []
            refresh()
        }
    }
    if (deductionData.deduction <= 0.3) {
        ded()
    } else {
        ElMessageBox.confirm('扣分数大于0.3分，确定吗', '小心', {
            type: 'warning',
            center: true,
            confirmButtonText: '是的',
            cancelButtonText: '算了',
        })
            .then(() => {
                ded()
            })
            .catch(() => {
                deductionData.person = 0
                deductionData.reason = ''
                deductionData.description = ''
                deductionData.deduction = 0
                deductionData.time = dayjs().format('YYYY/MM/DD HH:mm:ss')
                deductionData.place = ''
                typs.value = []
                refresh()
            })
    }
}
</script>

<template>
    <div>
        <h3>纪检部</h3>
        <el-tabs v-model="choice" tab-position="left">
            <el-tab-pane label="扣分数据" name="deduction">
                <el-skeleton :loading="isFetchingData" :rows="4" animated :throttle="500">
                    <template #default>
                        <el-card shadow="never">
                            <el-table :data="allData" max-height="640px" highlight-current-row :row-class-name="tableRowClassName">
                                <el-table-column type="expand">
                                    <template #header>
                                        <el-button type="text" :icon="Refresh" @click="refresh()"></el-button>
                                    </template>
                                    <template #default="props">
                                        <el-alert title="提醒：这不是Bug哦，这个真的是扣分编号" type="info" center :closable="false" />
                                        <el-descriptions :title="'扣分' + props.row.id + '信息'" border>
                                            <el-descriptions-item label="违纪者">
                                                {{ props.row.personnum }}
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
                                                <el-popover placement="top-start" title="申斥状态" :width="500" trigger="hover">
                                                    <template #reference>
                                                        <el-button type="text">
                                                            {{ fbstatus[props.row.status] }}
                                                        </el-button>
                                                    </template>
                                                    <span v-if="props.row.status !== 'normal'"> 申诉原因：{{ props.row.msgs.feedback }} </span>
                                                    <br />
                                                    <span v-if="props.row.status === 'failed'"> 驳回原因：{{ props.row.msgs.turndown }} </span>
                                                </el-popover>
                                            </el-descriptions-item>
                                        </el-descriptions>
                                        <p style="font-size: 14px">
                                            <span v-if="props.row.status !== 'normal'"> 申诉原因：{{ props.row.msgs.feedback }} </span>
                                            <br />
                                            <span v-if="props.row.status === 'failed'"> 驳回原因：{{ props.row.msgs.turndown }} </span>
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="personnum" label="违纪者" />
                                <el-table-column prop="deduction" label="扣分数" />
                                <el-table-column prop="reason" label="原因" />
                                <el-table-column prop="time" label="时间" />
                                <el-table-column align="right" fixed="right">
                                    <template #header>
                                        <el-button type="text" @click="newDeduction = true"> 新建扣分 </el-button>
                                    </template>
                                    <template #default="props">
                                        <el-button type="text" size="small" :disabled="props.row.status !== 'processing'" @click="turnDown(props)"> 驳回 </el-button>
                                        <el-popconfirm title="确定删除？" @confirm="deleteDeduction(props)">
                                            <template #reference>
                                                <el-button type="text" size="small" :disabled="props.row.status === 'failed'"> 删除 </el-button>
                                            </template>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </template>
                </el-skeleton>
            </el-tab-pane>
        </el-tabs>
        <el-dialog v-model="newDeduction" title="新建扣分" center width="60%">
            <el-form :model="deductionData" label-position="right">
                <el-form-item label="时间">
                    <el-date-picker v-model="deductionData.time" type="datetime" style="width: 100%" />
                </el-form-item>
                <el-form-item label="违纪者">
                    <el-input v-model="deductionData.person" />
                </el-form-item>
                <el-form-item label="扣分原因">
                    <el-select v-model="typs" style="width: 100%" multiple>
                        <el-option v-for="i in typicals" :key="i" :label="i" :value="i"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="扣分数">
                    <el-input v-model="deductionData.deduction" readonly></el-input>
                </el-form-item>
                <el-form-item label="地点">
                    <el-input v-model="deductionData.place"></el-input>
                </el-form-item>
                <el-form-item label="解释说明">
                    <el-input v-model="deductionData.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="newDeduction = false"> 取消 </el-button>
                    <el-button type="primary" :loading="isCreating" @click="submitDeduction"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style>
.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-lighter);
}
.el-table .error-row {
    --el-table-tr-bg-color: var(--el-color-error-lighter);
}
.el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-lighter);
}
</style>
