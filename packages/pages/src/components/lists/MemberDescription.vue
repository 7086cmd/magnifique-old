<!-- @format -->

<script setup lang="ts">
/* global member_processed */
import { defineProps, ref, toRefs, unref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{ data: member_processed }>();

const { data } = toRefs(props);

const detail = ref(unref(data) as member_processed);
</script>

<template>
  <div>
    <el-descriptions border direction="vertical">
      <el-descriptions-item :label="t('powers.member.desc.name')">
        {{ detail.name }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.member.desc.number')">
        <span v-text="detail.number"></span>
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.member.desc.department')">
        <el-tag type="info" v-text="detail.in"></el-tag>
        <el-tag type="info" v-text="detail.do"></el-tag>
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detail.duty"
        :label="t('powers.member.desc.duty')"
      >
        <el-tag
          v-for="item in detail.duty"
          :key="item"
          size="default"
          v-text="item"
        />
      </el-descriptions-item>
      <el-descriptions-item
        v-if="detail.admin"
        :label="t('powers.member.desc.admin')"
      >
        <el-tag
          v-for="item in detail.admin"
          :key="item"
          size="default"
          v-text="item"
        />
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.member.desc.score')">
        {{ detail.record.score }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.member.desc.vio')">
        {{ detail.record.violation }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.member.desc.fb')">
        {{ detail.record.actions }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
