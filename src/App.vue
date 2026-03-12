<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { useDark } from '@vueuse/core';
  import {
    darkTheme,
    zhCN,
    dateZhCN,
    enUS,
    dateEnUS,
    lightTheme,
    type GlobalThemeOverrides,
  } from 'naive-ui';
  import { convertToRgb } from './utils/convert';

  defineOptions({ name: 'App' });

  const { locale } = useI18n();
  // 1. 响应式暗黑模式管理
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  });
  const activeTheme = computed(() => (isDark.value ? darkTheme : lightTheme));
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
  const currentDateLocale = computed(() => (locale.value === 'zh-CN' ? dateZhCN : dateEnUS));
  const themeOverrides = computed((): GlobalThemeOverrides => {
    return {
      common: {
        fontFamily:
          'Alibaba PuHuiTi 3.0, -apple-system, blinkmacsystemfont, "Segoe UI", roboto, "Helvetica Neue", arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        primaryColor: convertToRgb('hsl(265, 64%, 50%)'),
        primaryColorHover: convertToRgb('hsl(261, 80%, 31%)'),
        primaryColorPressed: convertToRgb('hsl(267, 66%, 58%)'),
        primaryColorSuppl: convertToRgb('hsl(271, 70%, 76%)'),
      },
    };
  });
</script>

<template>
  <NConfigProvider
    class="h-full min-w-375px"
    :theme="activeTheme"
    :locale="currentLocale"
    :date-locale="currentDateLocale"
    :theme-overrides="themeOverrides"
    inline-theme-disabled
  >
    <NLoadingBarProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <NModalProvider>
              <RouterView v-slot="{ Component, route }">
                <keep-alive v-if="route.meta.keepAlive">
                  <component
                    :is="Component"
                    :key="route.fullPath"
                  />
                </keep-alive>
                <component
                  v-else
                  :is="Component"
                  :key="route.fullPath"
                />
              </RouterView>
            </NModalProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
