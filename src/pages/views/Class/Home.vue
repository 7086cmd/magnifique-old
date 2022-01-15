<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { gradeid, classid } = JSON.parse(window.atob(String(localStorage.getItem('classLoginInfo'))))
const gradeslist = ['', t('class.grades.1'), t('class.grades.2'), t('class.grades.3')]
</script>

<template>
    <div>
        <transition name="el-fade-in" appear>
            <div>
                <br />
                <h3>
                    {{
                        t('class-home.welcome', {
                            grade: gradeslist[gradeid],
                            class: classid,
                        })
                    }}
                </h3>
            </div>
        </transition>
        <transition name="el-fade-in" appear>
            <div>
                <h4>{{ t('class-home.introductions.1') }}</h4>
            </div>
        </transition>
        <transition name="el-fade-in" appear>
            <div>
                <h4>{{ t('class-home.introductions.2') }}</h4>
            </div>
        </transition>
    </div>
</template>
