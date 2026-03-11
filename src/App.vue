<script setup lang="ts">
  import { computed, provide, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useDark } from '@vueuse/core';
  import { darkTheme, zhCN, dateZhCN, enUS, dateEnUS, lightTheme } from 'naive-ui';
  import { useThemeAdapter } from '@/hooks/useThemeAdapter';

  defineOptions({ name: 'App' });

  const { locale } = useI18n();

  // 1. 暗黑模式管理
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  });

  // 2. 使用适配器获取动态 Tokens
  const { themeTokens, updateThemeTokens } = useThemeAdapter();

  const activeTheme = computed(() => (isDark.value ? darkTheme : lightTheme));
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
  const currentDateLocale = computed(() => (locale.value === 'zh-CN' ? dateZhCN : dateEnUS));

  /**
   * 3. 核心改造：符合 vBen 逻辑的切换函数
   */
  const toggleTheme = (event: MouseEvent) => {
    const isAppearanceTransition =
      // @ts-expect-error - 现代浏览器 API
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 如果不支持动画或没有点击事件，直接切换
    if (!isAppearanceTransition || !event) {
      isDark.value = !isDark.value;
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(async () => {
      // 执行模式切换
      isDark.value = !isDark.value;
      // 关键：等待 Vue 更新并强制适配器抓取最新的 CSS 变量
      await nextTick();
      updateThemeTokens();
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

      document.documentElement.animate(
        {
          // 逻辑修正：
          // 变深色(isDark=true): 扩散 [0, end]
          // 变浅色(isDark=false): 收缩 [end, 0]
          clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 450,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          // 核心修正：
          // 变深色: 动画作用于新图层(new)，此时 new 是深色
          // 变浅色: 动画作用于旧图层(old)，此时 old 是深色
          pseudoElement: isDark.value
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)',
        },
      );
    });
  };

  provide('toggleTheme', toggleTheme);
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="activeTheme"
    :theme-overrides="themeTokens"
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
