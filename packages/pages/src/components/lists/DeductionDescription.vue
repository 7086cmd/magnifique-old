<!-- @format -->

<script setup lang="ts">
/* global DeductionList */
import { defineProps, ref, toRefs, unref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  data: DeductionList;
}>();

const { data } = toRefs(props);

const detail = ref(unref(data) as DeductionList);
</script>
<template>
  <div>
    <el-descriptions border>
      <el-descriptions-item :label="t('powers.deduction.desc.person')">
        <member-dialog :number="detail.person" use-tag></member-dialog>
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.deduction.desc.deduction')">
        {{ detail.deduction }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.deduction.desc.reason')">
        <el-tag v-text="detail.reason" />
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.deduction.desc.place')">
        <el-tag v-text="detail.place" />
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.deduction.desc.time')">
        {{ detail.time }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.deduction.desc.deductor')">
        <member-dialog :number="detail.deductor.number" use-tag></member-dialog>
      </el-descriptions-item>
      <el-descriptions-item :label="t('powers.deduction.desc.description')">
        {{ detail.description }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
