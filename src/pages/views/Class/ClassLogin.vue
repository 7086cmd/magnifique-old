<script lang="ts" setup>
import { ref, provide } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import baseurl from '../../modules/baseurl'
import { Close, Minus, Plus, ArrowLeft } from '@element-plus/icons-vue'

let isClient = ref(false)
const { t } = useI18n()
const router = useRouter()
let gradeid = ref('')
let classid = ref(0)
let password = ref('')
let isPwd = ref(true)
const grades = [
    {
        label: '初一',
        value: '1',
    },
    {
        label: '初二',
        value: '2',
    },
    {
        label: '初三',
        value: '3',
    },
]

try {
    if (window.magnifique.isElectron === true) {
        isClient.value = true
    }
    // eslint-disable-next-line no-empty
} catch (_e) {}

async function login() {
    let grade = parseInt(gradeid.value)
    axios({
        url: `${baseurl}class/${grade}/${classid.value}/login?password=${window.btoa(password.value)}`,
        method: 'get',
    }).then((response) => {
        if (response.data.status == 'ok') {
            let timeOut = 3
            ElMessageBox.alert(t('class.status.jump', { sec: timeOut }), t('class.status.success'), {
                type: 'success',
                center: true,
            }).then(() => {
                router.push('/class/')
            })
            provide(
                'classLoginInfo',
                window.btoa(
                    JSON.stringify({
                        gradeid: grade,
                        classid: classid.value,
                        password: window.btoa(password.value),
                    })
                )
            )
            localStorage.setItem(
                'classLoginInfo',
                window.btoa(
                    JSON.stringify({
                        gradeid: grade,
                        classid: classid.value,
                        password: window.btoa(password.value),
                    })
                )
            )
            setTimeout(() => {
                router.push('/class/')
            }, 3000)
        } else {
            localStorage.removeItem('classLoginInfo')
            ElMessageBox.alert(
                t('dialogs.' + response.data.reason, {
                    msg: response.data.text,
                }),
                t('class.status.error'),
                {
                    type: 'error',
                    center: true,
                }
            )
        }
    })
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
const toHome = () => {
    router.push('/')
}
</script>
<template>
    <transition name="el-zoom-in-top" appear>
        <el-container>
            <el-header>
                <div style="text-align: right">
                    <el-button v-if="isClient" style="text-align: left" :icon="ArrowLeft" type="primary" circle plain size="small" @click="toHome()" />
                    <el-button v-if="isClient" style="text-align: right" :icon="Minus" type="warning" circle plain size="small" @click="minServerWindow()" />
                    <el-button v-if="isClient" style="text-align: right" :icon="Plus" type="success" circle plain size="small" @click="maxServerWindow()" />
                    <el-button v-if="isClient" style="text-align: right" :icon="Close" type="danger" circle plain size="small" @click="closeServer()" />
                </div>
            </el-header>
            <el-container>
                <el-aside width="5%" />

                <el-main>
                    <el-form @submit="login">
                        <h2>{{ t('class.login.title') }}</h2>
                        <el-form-item label="年级">
                            <el-select v-model="gradeid" outlined :placeholder="t('please-choose')" style="width: 100%" :label="t('class.grade')">
                                <el-option v-for="item in grades" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班级">
                            <el-input-number v-model="classid" outlined style="width: 100%" controls-position="right" type="number" :label="t('class.class')" />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="password" outlined style="width: 100%" :type="isPwd ? 'password' : 'text'" :label="t('class.password')">
                                <template #append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    <el-button :label="t('submit')" outline plain type="primary" style="width: 100%" @click="login">
                        {{ t('submit') }}
                    </el-button>
                </el-main>
                <el-aside width="5%" />
            </el-container>
        </el-container>
    </transition>
</template>
