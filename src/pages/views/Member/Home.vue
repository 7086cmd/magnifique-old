<script lang="ts" setup>
import { ref, inject, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import { UserFilled as User, Close, Plus, Minus, List, Back, Box, Odometer, Magnet, Tools } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

let heightClient = ref(window.innerHeight)

const list = {
    主席团: 'zxt',
    纪检部: 'jjb',
    文体部: 'wtb',
    宣传部: 'xcb',
    青志部: 'qzb',
    学习部: 'xxb',
}
let isClient = ref(false)
const router = useRouter()
const { t } = useI18n()
const leftDrawerOpen = ref(true)
let reset_password = ref(false)
let pageSelected = ref('1')
let newpwd = reactive({
    oldpwd: '',
    newpwd1: '',
    newpwd2: '',
})
let name = ref('')
let inGroup = ref('')
let inCfg = ref(false)

try {
    if (window.magnifique.isElectron === true) {
        isClient.value = true
    }
    // eslint-disable-next-line no-empty
} catch (_e) {}

if (sessionStorage.getItem('memberLoginInfo') == undefined) {
    if (inject('memberLoginInfo') == undefined) {
        router.push('/member/login/')
    }
}
try {
    window.atob(String(sessionStorage.getItem('memberLoginInfo')))
} catch (e) {
    router.push('/member/login/')
    sessionStorage.removeItem('memberLoginInfo')
}

const { number, password } = JSON.parse(window.atob(String(sessionStorage.getItem('memberLoginInfo'))))

axios({
    url: `${baseurl}member/getinfo/${number}/`,
}).then((response) => {
    name.value = response.data.details.name
    inGroup.value = response.data.details.in
    if (response.data.details.do.split('').reverse()[0] == '长' || response.data.details.do.split('').reverse()[0] == '席') {
        inCfg.value = true
    }
})

axios({
    url: `${baseurl}member/${number}/login?password=${password}`,
    data: {
        password: password,
    },
    method: 'get',
}).then((response) => {
    if (response.data.status !== 'ok') {
        sessionStorage.removeItem('memberLoginInfo')
        router.push('/member/login')
    }
})
const npd = () => {
    if (newpwd.newpwd1 === newpwd.newpwd2) {
        axios({
            url: `${baseurl}member/${number}/edit/password`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            data: JSON.stringify({
                id: number,
                newp: window.btoa(newpwd.newpwd1),
                password,
            }),
        }).then((response) => {
            if (response.data.status == 'ok') {
                ElMessageBox.alert('成功', '修改密码', {
                    type: 'success',
                    center: true,
                }).then(() => {
                    sessionStorage.removeItem('memberLoginInfo')
                    router.push('/member/login')
                })
            } else {
                ElMessageBox.alert(
                    t('dialogs.' + response.data.reason, {
                        msg: response.data.text,
                    }),
                    '错误',
                    {
                        type: 'error',
                        center: true,
                    }
                )
            }
        })
    } else {
        ElMessageBox.alert('密码输入不一致', '错误', {
            type: 'error',
            center: true,
        })
    }
}
const openPassword = () => {
    reset_password.value = true
}
const exit = () => {
    sessionStorage.removeItem('memberLoginInfo')
    router.push('/member/login')
}
const closeServer = () => {
    window.magnifique.closeServer()
}
const minServerWindow = () => {
    window.magnifique.minServerWindow()
}
const maxServerWindow = () => {
    window.magnifique.maxServerWindow()
}
</script>
<template>
    <el-container>
        <el-aside width="12%">
            <el-menu v-model="pageSelected" default-active="/member/" :collapse="leftDrawerOpen" style="min-height: 1024px; padding-top: 2em" collapse-transition router>
                <el-menu-item index="/">
                    <el-icon>
                        <Back />
                    </el-icon>
                    <template #title> 返回主页 </template>
                </el-menu-item>
                <el-menu-item index="/member/">
                    <el-icon>
                        <Odometer />
                    </el-icon>
                    <template #title> 仪表盘 </template>
                </el-menu-item>
                <el-menu-item index="/member/workflow/">
                    <el-icon>
                        <List />
                    </el-icon>
                    <template #title> 工作流 </template>
                </el-menu-item>
                <el-menu-item index="/member/information/">
                    <el-icon>
                        <User />
                    </el-icon>
                    <template #title> 个人信息 </template>
                </el-menu-item>
                <el-menu-item v-if="inGroup !== '主席团'" :index="`/member/${list[inGroup]}/`">
                    <el-icon>
                        <Tools />
                    </el-icon>
                    <template #title> 部门功能 </template>
                </el-menu-item>
                <el-menu-item v-if="inCfg" :index="'/member/admin/'">
                    <el-icon>
                        <Magnet />
                    </el-icon>
                    <template #title> 管理 </template>
                </el-menu-item>
                <el-menu-item index="/member/message/">
                    <el-icon>
                        <Box />
                    </el-icon>
                    <template #title> 消息中心 </template>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header style="text-align: right">
                <el-affix :offset="20">
                    <el-dropdown split-button plain>
                        <el-icon>
                            <User />
                        </el-icon>
                        {{ name }}
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-icon>
                                        <MessageBox />
                                    </el-icon>
                                    {{ t('class-dropdown.feed-back') }}
                                </el-dropdown-item>
                                <el-dropdown-item command="new_password" @click="openPassword">
                                    <el-icon>
                                        <Edit />
                                    </el-icon>
                                    {{ t('class-dropdown.edit-password') }}
                                </el-dropdown-item>
                                <el-dropdown-item @click="exit">
                                    <el-icon>
                                        <Close />
                                    </el-icon>
                                    {{ t('class-dropdown.log-out') }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-divider v-if="isClient" direction="vertical" />
                    <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()" />
                    <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()" />
                    <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()" />
                </el-affix>
            </el-header>

            <el-main>
                <el-scrollbar always :height="Math.floor((heightClient * 4) / 5)">
                    <router-view v-slot="{ Component }">
                        <el-scrollbar always>
                            <transition name="fade">
                                <el-scrollbar always>
                                    <component :is="Component" />
                                </el-scrollbar>
                            </transition>
                        </el-scrollbar>
                    </router-view>
                </el-scrollbar>
                <el-drawer v-model="reset_password" title="修改密码" direction="btt" size="60%">
                    <el-form v-model="newpwd">
                        <el-form-item label="原密码">
                            <el-input v-model="newpwd.oldpwd" type="password" />
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="newpwd.newpwd1" type="password" />
                        </el-form-item>
                        <el-form-item label="新密码">
                            <el-input v-model="newpwd.newpwd2" type="password" />
                        </el-form-item>
                        <el-form-item>
                            <el-button plain @click="reset_password = false"> 取消 </el-button>
                            <el-button type="primary" plain @click="npd"> 确定 </el-button>
                        </el-form-item>
                    </el-form>
                </el-drawer>
            </el-main>
        </el-container>
    </el-container>
</template>
