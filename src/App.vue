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
      primaryColor: '#5468ff',
      primaryColorHover: '#4a5cd3',
      primaryColorPressed: '#3d4eb8',
      fontFamily: "'Alibaba PuHuiTi 3.0', sans-serif",
      borderRadius: '8px',
    },
    Layout: {
      // 侧边栏背景色和边框颜色
      siderColor: 'var(--sb-bg-item)',
      siderBorderColor: 'var(--sb-border)',
    },
    Menu: {
      // 1. 基础文字颜色
      itemTextColor: 'var(--sb-text-main)',
      itemTextColorHover: 'var(--sb-primary)',
      itemIconColor: 'var(--sb-text-main)',
      itemIconColorHover: 'var(--sb-primary)',

      // 2. 选中状态样式 (Active)
      itemTextColorActive: 'var(--sb-primary)',
      itemIconColorActive: 'var(--sb-primary)',
      itemTextColorActiveHover: 'var(--sb-primary)',
      itemIconColorActiveHover: 'var(--sb-primary)',

      // 3. 选中状态的背景 (使用你 global.css 里的 light 变量)
      itemColorActive: 'var(--sb-primary-light)',
      itemColorActiveHover: 'var(--sb-primary-light)',

      // 4. 树形菜单箭头颜色
      arrowColor: 'var(--sb-text-muted)',
      arrowColorHover: '#5468ff',
      arrowColorActive: '#5468ff',

      // 5. 间距与圆角
      itemHeight: '42px',
      borderRadius: '8px',
    },
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
