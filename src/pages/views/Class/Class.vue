<script lang="ts" setup>
import { ref, inject, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import axios from 'axios'
import baseurl from '../../modules/baseurl'
import { UserFilled as User, Close, HomeFilled as Home, List, Back, PieChart, Box, Plus, Minus } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

let heightClient = ref(window.innerHeight)

setInterval(() => {
    heightClient.value = window.innerHeight
}, 200)

let isClient = ref(false)
const router = useRouter()
const { t } = useI18n()
const leftDrawerOpen = ref(true)
let reset_password = ref(false)
let feedbackdialogOpen = ref(false)
let isSubmitingPassword = ref(false)
let isSubmitingFeedBack = ref(false)
let pageSelected = ref('1')
let newpwd = reactive({
    oldpwd: '',
    newpwd1: '',
    newpwd2: '',
})
const aname = ref('')

try {
    if (window.magnifique.isElectron === true) {
        isClient.value = true
    }
    // eslint-disable-next-line no-empty
} catch (_e) {}

if (localStorage.getItem('classLoginInfo') == undefined || localStorage.getItem('classLoginInfo') == null) {
    if (inject('classLoginInfo') == undefined) {
        router.push('/class/login/')
    }
}

try {
    window.atob(String(localStorage.getItem('classLoginInfo')))
} catch (e) {
    router.push('/class/login/')
    localStorage.removeItem('classLoginInfo')
}

const { gradeid, classid, password } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
let feedbackin = reactive({
    title: '',
    description: '',
    from: 'class',
    more: {
        class: classid,
        grade: gradeid,
    },
})
aname.value = t('class-expression', {
    grade: t('class.grades.' + gradeid),
    class: classid,
})

const reqUrl = `${baseurl}class/${gradeid}/${classid}/login?password=${password}`
axios({
    url: reqUrl,
    data: {
        password: password,
    },
    method: 'get',
}).then((response) => {
    if (response.data.status !== 'ok') {
        localStorage.removeItem('classLoginInfo')
        router.push('/class/login')
    } else {
        if (isClient.value) {
            window.magnifique.describeNotification(gradeid, classid)
        }
    }
})

const npd = () => {
    if (newpwd.newpwd1 === newpwd.newpwd2) {
        isSubmitingPassword.value = true
        axios({
            url: `${baseurl}class/edit/password`,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            params: JSON.stringify({
                gradeid,
                classid,
                newp: window.btoa(newpwd.newpwd1),
                password: window.btoa(newpwd.oldpwd),
            }),
            data: JSON.stringify({
                gradeid,
                classid,
                newp: window.btoa(newpwd.newpwd1),
                password: window.btoa(newpwd.oldpwd),
            }),
        }).then((response) => {
            isSubmitingPassword.value = false
            if (response.data.status == 'ok') {
                ElMessageBox.alert('成功', '修改密码', {
                    type: 'success',
                    center: true,
                }).then(() => {
                    localStorage.removeItem('classLoginInfo')
                    router.push('/class/login')
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
    localStorage.removeItem('classLoginInfo')
    router.push('/class/login')
}

const fbsub = async () => {
    isSubmitingFeedBack.value = true
    const response = await axios({
        url: `${baseurl}feed/back`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        data: feedbackin,
    })
    const tit = feedbackin.title
    feedbackin.title = ''
    feedbackin.description = ''
    feedbackdialogOpen.value = false
    isSubmitingFeedBack.value = false
    if (response.data.status == 'ok') {
        ElMessageBox.alert(`标题"${tit}"的反馈已收到`, '提交成功', {
            type: 'success',
            center: true,
        })
    } else {
        ElMessageBox.alert(
            t('dialogs.' + response.data.reason, {
                msg: response.data.text,
            }),
            '反馈失败',
            {
                type: 'error',
                center: true,
            }
        )
    }
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
        <el-container>
            <el-aside width="12%">
                <el-menu v-model="pageSelected" default-active="/class/" :collapse="leftDrawerOpen" collapse-transition router :style="'padding-top: 2em; height: ' + String(heightClient) + 'px'">
                    <el-menu-item index="/">
                        <el-icon>
                            <Back />
                        </el-icon>
                        <template #title>{{ t('class-home.menu.1') }}</template>
                    </el-menu-item>
                    <el-menu-item index="/class/">
                        <el-icon>
                            <Home />
                        </el-icon>
                        <template #title>{{ t('class-home.menu.2') }}</template>
                    </el-menu-item>
                    <el-menu-item index="/class/list/">
                        <el-icon>
                            <List />
                        </el-icon>
                        <template #title>{{ t('class-home.menu.3') }}</template>
                    </el-menu-item>
                    <el-menu-item index="/class/chart/">
                        <el-icon>
                            <PieChart />
                        </el-icon>
                        <template #title>{{ t('class-home.menu.4') }}</template>
                    </el-menu-item>
                    <el-menu-item index="/class/member/">
                        <el-icon>
                            <User />
                        </el-icon>
                        <template #title>{{ t('class-home.menu.5') }}</template>
                    </el-menu-item>
                    <el-menu-item index="/class/message/">
                        <el-icon>
                            <Box />
                        </el-icon>
                        <template #title>{{ t('class-home.menu.6') }}</template>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header reveal bordered class="bg-white text-black" style="text-align: right">
                    <el-affix :offset="20">
                        <el-dropdown split-button plain>
                            <el-icon>
                                <User />
                            </el-icon>
                            {{ aname }}
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="feedbackdialogOpen = true">
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
                                <el-button plain @click="reset_password = false">取消</el-button>
                                <el-button type="primary" plain @click="npd">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-drawer>
                    <el-drawer v-model="feedbackdialogOpen" title="问题反馈" direction="btt" size="60%">
                        <el-form v-model="feedbackin">
                            <el-form-item label="反馈标题">
                                <el-input v-model="feedbackin.title" />
                            </el-form-item>
                            <el-form-item label="反馈内容">
                                <el-input v-model="feedbackin.description" type="textarea" :autosize="{ minRows: 6, maxRows: 10 }" />
                            </el-form-item>
                            <el-form-item>
                                <el-button plain @click="feedbackdialogOpen = false">取消</el-button>
                                <el-button type="primary" plain @click="fbsub">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-drawer>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>
