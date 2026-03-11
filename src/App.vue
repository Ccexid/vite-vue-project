<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDark } from '@vueuse/core';
  import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS, type GlobalThemeOverrides } from 'naive-ui';

  // 1. 获取当前语言
  const { locale } = useI18n();

  // 2. 暗黑模式
  const isDark = useDark();
  const activeTheme = computed(() => (isDark.value ? darkTheme : null));

  // 3. 语言包映射
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
  const currentDateLocale = computed(() => (locale.value === 'zh-CN' ? dateZhCN : dateEnUS));

  // 4. 样式覆盖：确保 Naive UI 使用你的 global.css 变量
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      fontFamily:
        '"Alibaba PuHuiTi 3.0", v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontFamilyMono:
        '"Alibaba PuHuiTi 3.0",v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
    },
  };
</script>

<template>
  <NConfigProvider
    abstract
    :theme="activeTheme"
    :theme-overrides="themeOverrides"
    :locale="currentLocale"
    :date-locale="currentDateLocale"
    inline-theme-disabled
    tag="section"
  >
    <NGlobalStyle />
    <NLoadingBarProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <NModalProvider>
              <RouterView v-slot="{ Component, route }">
                <Transition
                  :name="(route.meta.transition as string) || 'fade'"
                  mode="out-in"
                >
                  <component
                    :is="Component"
                    :key="route.fullPath"
                  />
                </Transition>
              </RouterView>
            </NModalProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
<style>
  /* 全局转场动画示例 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
