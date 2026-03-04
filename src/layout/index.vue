<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';

  // 导入图标 (假设你使用 unplugin-icons)
  import IEpHouse from '~icons/ep/house';
  import IEpSetting from '~icons/ep/setting';
  import type { MenuOption } from 'naive-ui';
  import type { SearchItem } from '@/types/search-box';

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

  // 原始数据池
  const options = ref<SearchItem[]>([]);
  // 搜索关键字状态
  const searchQuery = ref('');

  /**
   * 优化：使用 computed 替代手动维护 searchList
   * 1. 自动响应 searchQuery 和 options 的变化
   * 2. 避免了 query 为空时逻辑判断的冗余
   */
  const filteredList = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return options.value;

    return options.value.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query),
    );
  });

  /**
   * 接收子组件传来的关键字
   */
  const handleSearch = (query: string) => {
    searchQuery.value = query;
  };

  onMounted(() => {
    // 优化：直接赋值比循环 push 效率更高
    options.value = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `选项 ${i + 1}`,
      description: `这是选项 ${i + 1} 的描述`,
    }));
  });
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
            <SearchBox
              :options="filteredList"
              @search="handleSearch"
            />
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
