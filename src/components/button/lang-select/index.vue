<script lang="ts" setup>
  import { computed } from 'vue';
  import { NPopselect, NButton } from 'naive-ui';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';

  defineOptions({ name: 'LangSelectButton' });

  // 1. 获取 i18n 实例中的 locale
  const { locale } = useI18n();

  // 2. 核心：使用与 i18n.ts 相同的 Storage Key ('selected-lang')
  // 这样这里修改 language，i18n.ts 里的监听器和本地存储会同步更新
  const language = useStorage('selected-lang', 'zh-CN');

  const langOptions = [
    {
      label: '中文',
      value: 'zh-CN',
    },
    {
      label: 'English',
      value: 'en',
    },
  ];

  // 3. 这里的 watch 是为了确保当前组件的 i18n 实例能响应 storage 的变化
  // 虽然 i18n.ts 处理了全局和 dayjs，但组件内部的 locale 需要显式绑定
  watch(
    language,
    (val) => {
      locale.value = val;
    },
    { immediate: true },
  );

  // 4. 计算当前显示的 Label
  const currentLabel = computed(() => {
    return langOptions.find((opt) => opt.value === language.value)?.label || 'Language';
  });
</script>

<template>
  <NPopselect
    v-model:value="language"
    :options="langOptions"
    trigger="click"
  >
    <NButton
      type="primary"
      text
    >
      <template #icon>
        <IPrimeLanguage />
      </template>
      {{ currentLabel }}
    </NButton>
  </NPopselect>
</template>
