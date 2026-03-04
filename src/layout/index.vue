<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';

  // 导入业务组件
  import AppAside from '@/layout/components/app-aside/index.vue';

  // 导入图标 (假设你使用 unplugin-icons)
  import IEpHouse from '~icons/ep/house';
  import IEpSetting from '~icons/ep/setting';
  import type { MenuOption } from 'naive-ui';

  const route = useRoute();
  const { locale, t } = useI18n();

  // 1. 状态管理
  const isCollapsed = useStorage('sidebar-collapsed', false);
  const activeKey = ref<string>((route.name as string) || 'dashboard');

  // 2. 菜单配置 (Tree 类型)
  const menuOptions: MenuOption[] = [
    {
      label: () => t('route.dashboard'),
      key: 'dashboard',
      icon: () => h(IEpHouse),
      children: [
        {
          label: () => t('route.dashboardOverview'),
          icon: () => h(IEpHouse),
          key: 'dashboard-overview',
        },
        {
          label: () => t('route.dashboardAnalysis'),
          icon: () => h(IEpSetting),
          key: 'dashboard-analysis',
        },
      ],
    },
    {
      label: () => t('route.scheme'),
      key: 'scheme',
      icon: () => h(IEpSetting),
    },
  ];

  // 3. 页面标题同步
  const updateTitle = () => {
    const titleKey = route.meta?.title as string;
    if (titleKey) document.title = t(titleKey);
  };
  watch(
    [locale, () => route.path],
    () => {
      updateTitle();
      activeKey.value = (route.name as string) || 'dashboard';
    },
    { immediate: true },
  );
</script>

<template>
  <n-layout
    has-sider
    class="h-full w-full overflow-hidden"
  >
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="isCollapsed"
      class="bg-[var(--sb-bg-item)]! border-r-[var(--sb-border)]!"
    >
      <AppAside
        :is-collapsed="isCollapsed"
        :menu-options="menuOptions"
        v-model:active-key="activeKey"
        @toggle="isCollapsed = !isCollapsed"
      />
    </n-layout-sider>

    <n-layout class="bg-[var(--sb-bg-layout)]!">
      <n-layout-header
        bordered
        class="h-60px px-20px flex items-center justify-between bg-[var(--sb-bg-item)]! border-b-[var(--sb-border)]!"
      >
        <div class="flex items-center gap-12px">
          <slot name="header-left">
            <SearchBox />
          </slot>
        </div>

        <div class="flex items-center gap-16px">
          <slot name="header-right">
            <LangSelect />
            <DarkCheckBox />
          </slot>
        </div>
      </n-layout-header>

      <n-layout-content
        content-style="padding: 20px;"
        class="bg-[var(--sb-bg-layout)]!"
        :native-scrollbar="false"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade-transform"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: all 0.3s ease;
  }
  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-15px);
  }
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(15px);
  }

  /* 配合全局暗黑模式 GSAP 裁剪动画 */
  :global(html[style*='--ripple-radius']) {
    .n-layout,
    .n-layout-sider,
    .n-layout-header,
    .n-layout-content {
      transition: none !important;
    }
  }
</style>
