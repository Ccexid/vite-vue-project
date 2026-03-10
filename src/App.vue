<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDark } from '@vueuse/core';
  import {
    NConfigProvider,
    NGlobalStyle,
    darkTheme,
    zhCN,
    dateZhCN,
    enUS,
    dateEnUS,
    type GlobalThemeOverrides,
    NLoadingBarProvider,
  } from 'naive-ui';

  // 1. 获取当前语言
  const { locale } = useI18n();

  // 2. 获取暗黑模式状态 (保持你现有的配置)
  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  });

  // 3. 动态映射 Naive UI 语言包
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
  const currentDateLocale = computed(() => (locale.value === 'zh-CN' ? dateZhCN : dateEnUS));

  // 4. 样式覆盖：确保 Naive UI 使用你的 global.css 变量
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      fontFamily:
        '"Alibaba PuHuiTi 3.0", v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontFamilyMono:
        '"Alibaba PuHuiTi 3.0",v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace',
      primaryColor: '#7384FFFF',
      primaryColorHover: '#3F54EEFF',
      primaryColorPressed: '#453FEEFF',
      primaryColorSuppl: '#5F6ED9FF',
      boxShadow1: '0 15px 50px -10px rgba(0, 0, 0, 0.6)',
      boxShadow2: ' 0 1px 3px rgba(0, 0, 0, 0.4)',
    },
  };

  // 5. 关键：主题切换逻辑
  // 注意：由于你使用了 GSAP 裁剪动画，Naive UI 的主题切换必须跟随 isDark.value
  const activeTheme = computed(() => (isDark.value ? darkTheme : null));
</script>

<template>
  <NConfigProvider
    abstract
    class="w-full h-full"
    :theme="activeTheme"
    :theme-overrides="themeOverrides"
    :locale="currentLocale"
    :date-locale="currentDateLocale"
    preflight-style-disabled
    inline-theme-disabled
  >
    <NGlobalStyle />
    <NLoadingBarProvider>
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.transition || 'fade'">
          <component
            :is="Component"
            :key="route.fullPath"
          />
        </Transition>
      </RouterView>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
