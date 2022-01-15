<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import axios from 'axios'
import baseurl from '../../modules/baseurl'

const { number } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let data: Ref<any> = ref({})
let caught = ref(false)
const loading = ElLoading.service({
    text: '正在获取信息',
})
const router = useRouter()
if (sessionStorage.getItem('memberLoginInfo') == undefined) {
    router.push('/member/login/')
}
try {
    window.atob(String(sessionStorage.getItem('memberLoginInfo')))
} catch (e) {
    router.push('/member/login/')
    sessionStorage.removeItem('memberLoginInfo')
}
axios({
    url: `${baseurl}member/getinfo/${number}/`,
}).then((response) => {
    data.value = response.data.details
    loading.close()
    caught.value = true
})
</script>
<template>
    <transition name="el-fade-in" appear>
        <div>
            <h3 v-if="caught">{{ '成员' + data.number + '信息' }}</h3>
            <el-descriptions v-if="caught" border>
                <el-descriptions-item label="姓名">
                    {{ data.name }}
                </el-descriptions-item>
                <el-descriptions-item label="学号">
                    {{ data.number }}
                </el-descriptions-item>
                <el-descriptions-item label="所属部门">
                    {{ data.in }}
                </el-descriptions-item>
                <el-descriptions-item label="职务">
                    {{ String(data.do).replace('undefined', '') }}
                </el-descriptions-item>
                <el-descriptions-item label="是否为主席团成员">
                    {{ data.icg ? '是' : '不是' }}
                </el-descriptions-item>
                <el-descriptions-item label="素质分">
                    {{ data.record.score }}
                </el-descriptions-item>
                <el-descriptions-item label="违纪次数">
                    {{ data.record.violation }}
                </el-descriptions-item>
                <el-descriptions-item label="反馈次数">
                    {{ data.record.actions }}
                </el-descriptions-item>
            </el-descriptions>
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
</style>
