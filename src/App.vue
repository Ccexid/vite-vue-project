<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { useDark } from '@vueuse/core';
  import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS, lightTheme } from 'naive-ui';

  defineOptions({ name: 'App' });

  const { locale } = useI18n();

  // 1. 响应式暗黑模式管理
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  });

  // 首屏挂载时同步一次初始状态

  const activeTheme = computed(() => (isDark.value ? darkTheme : lightTheme));
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
  const currentDateLocale = computed(() => (locale.value === 'zh-CN' ? dateZhCN : dateEnUS));
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="activeTheme"
    :locale="currentLocale"
    :date-locale="currentDateLocale"
    inline-theme-disabled
  >
    <NLoadingBarProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <NModalProvider>
              <RouterView />
            </NModalProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
