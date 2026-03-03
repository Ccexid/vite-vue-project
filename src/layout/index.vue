<script setup lang="ts">
  import { watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import AppAside from '@/layout/components/app-aside/index.vue';
  import AppMenu from '@/layout/components/app-menu/index.vue';
  import IEpHouse from '~icons/ep/house';
  import IEpDocument from '~icons/ep/document';
  import IEpPieChart from '~icons/ep/pie-chart';
  import IEpFiles from '~icons/ep/files';
  import type { SearchItem } from '@/types/search-box';

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

  const route = useRoute();
  const { locale, t } = useI18n();

  const menuData = [
    {
      id: 1,
      label: 'route.dashboard',
      icon: IEpHouse,
      children: [
        {
          id: 11,
          label: 'route.dashboardOverview',
          icon: IEpDocument,
          path: '/',
        },
        {
          id: 12,
          label: 'route.dashboardAnalysis',
          icon: IEpPieChart,
          path: '/',
        },
      ],
    },
    { id: 2, label: 'route.scheme', icon: IEpFiles, path: '/404' },
  ];

  const isCollapsed = useStorage('sidebar-collapsed', false);
  const toggleAside = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  // 标题实时同步逻辑
  const updateTitle = () => {
    const titleKey = route.meta?.title as string;
    if (titleKey) document.title = t(titleKey);
  };

  watch(locale, () => updateTitle(), { immediate: true });
  watch(
    () => route.path,
    () => updateTitle(),
  );

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
  <section class="app-layout">
    <AppAside
      :is-collapsed="isCollapsed"
      @toggle="toggleAside"
    >
      <AppMenu
        :items="menuData"
        :is-collapsed="isCollapsed"
        mode="vertical"
      />
    </AppAside>

    <section class="app-layout-container">
      <header class="app-layout-header">
        <div class="header-left">
          <slot name="header-left">
            <SearchBox
              :options="filteredList"
              @search="handleSearch"
            />
          </slot>
        </div>

        <div class="header-right">
          <slot name="header-right">
            <div class="header-actions">
              <LangSelect />
              <DarkCheckBox />
            </div>
          </slot>
        </div>
      </header>

      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition
            name="fade-transform"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </section>
  </section>
</template>

<style lang="less" scoped>
  .app-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: var(--sb-bg-layout);

    &-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &-header {
      height: 60px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--sb-bg-item);
      border-bottom: 1px solid var(--sb-border);
      position: relative;
      z-index: 100;

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    // 语言选择器样式
    .lang-selector {
      position: relative;

      .lang-trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        color: var(--sb-text-main);

        &:hover,
        &.is-active {
          background-color: var(--sb-bg-layout);
          border-color: var(--sb-border);
        }

        .lang-icon {
          font-size: 16px;
        }
        .current-lang {
          font-size: 13px;
          font-weight: 500;
        }
        .arrow-icon {
          font-size: 12px;
          transition: transform 0.3s;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }

      .lang-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 120px;
        background-color: var(--sb-bg-item);
        border: 1px solid var(--sb-border);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 4px;
        overflow: hidden;

        .lang-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          color: var(--sb-text-main);
          transition: background 0.2s;

          &:hover {
            background-color: var(--sb-bg-layout);
          }

          &.is-selected {
            color: var(--sb-primary);
            font-weight: bold;
            background-color: var(--sb-primary-light);
          }

          .check-icon {
            font-size: 12px;
          }
        }
      }
    }

    .app-main {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .app-footer {
      padding: 15px 0;
      text-align: center;
      color: var(--sb-text-muted);
      font-size: 12px;
    }
  }

  // 下拉动画
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.2s ease-out;
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  // 路由过渡动画
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
</style>
