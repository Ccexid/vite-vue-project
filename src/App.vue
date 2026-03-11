<script setup lang="ts">
  import { computed, provide } from 'vue';
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

  defineOptions({ name: 'App' });

  const { locale } = useI18n();

  /**
   * 1. 暗黑模式管理
   * disableTransition: true 禁用 vueuse 默认的类切换动画，由我们手动接管
   */
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  });

  // 2. 主题与语言包适配
  const activeTheme = computed(() => (isDark.value ? darkTheme : lightTheme));
  const currentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
  const currentDateLocale = computed(() => (locale.value === 'zh-CN' ? dateZhCN : dateEnUS));

  /**
   * 3. 核心：封装切换函数并提供给子组件 (Header 等)
   * 这样子组件只需要调用 toggleTheme(event) 即可实现圆形扩散
   */
  const toggleTheme = (event: MouseEvent) => {
    const isAppearanceTransition =
      // @ts-expect-error - 浏览器新 API 类型扩展
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
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
      isDark.value = !isDark.value;
      // 强制等待 Vue 渲染更新，确保快照抓取的是切换后的状态
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        {
          clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)',
        },
      );
    });
  };

  // 将切换方法注入全局，方便子组件调用
  provide('toggleTheme', toggleTheme);

  // 4. 样式覆盖
  const themeOverrides: GlobalThemeOverrides = {
    common: {
      fontFamily: 'var(--font-family)', // 直接引用你 css 里的变量
      fontFamilyMono: 'var(--font-family)',
    },
  };
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="activeTheme"
    :theme-overrides="themeOverrides"
    :locale="currentLocale"
    :date-locale="currentDateLocale"
    inline-theme-disabled
  >
    <NGlobalStyle />
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
