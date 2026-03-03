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
      primaryColor: '#5468ff', // 对应 --sb-primary
      primaryColorHover: '#4a5cd3', // 对应 --sb-primary-hover
      fontFamily: "'Alibaba PuHuiTi 3.0', sans-serif", // 对应 fonts.css
      borderRadius: '8px',
    },
    // 你可以根据需要继续微调其他组件
  };

  // 5. 关键：主题切换逻辑
  // 注意：由于你使用了 GSAP 裁剪动画，Naive UI 的主题切换必须跟随 isDark.value
  const activeTheme = computed(() => (isDark.value ? darkTheme : null));
</script>

<template>
  <NConfigProvider
    class="w-full h-full"
    :theme="activeTheme"
    :theme-overrides="themeOverrides"
    :locale="currentLocale"
    :date-locale="currentDateLocale"
  >
    <NGlobalStyle />

    <RouterView v-slot="{ Component, route }">
      <Transition :name="route.meta.transition || 'fade'">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </Transition>
    </RouterView>
  </NConfigProvider>
</template>
