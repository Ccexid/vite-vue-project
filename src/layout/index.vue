<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';

  // 工具函数与路由配置
  import { mapRouterToMenu, transformRoutesToSearchItems } from '@/utils/menu-helper';
  import { dashboardRoutes } from '@/router/index';
  import type { SearchItem } from '@/types/search-box';

  const route = useRoute();
  const router = useRouter();
  const { locale, t } = useI18n();

  // 1. 状态管理
  const isCollapsed = useStorage('sidebar-collapsed', false);
  const activeKey = ref<string>((route.name as string) || 'dashboard');

  // 2. 菜单配置：利用 computed 自动响应国际化语言切换
  const menuOptions = computed(() => mapRouterToMenu(dashboardRoutes, t));

  // 3. 搜索选项配置：将路由转换为搜索框所需的格式
  const searchOptions = computed(() => transformRoutesToSearchItems(dashboardRoutes, t));

  // 4. 处理搜索结果点击：点击后跳转至对应路由
  const handleSearchClick = (item: SearchItem) => {
    if (item.name) {
      router.push({ name: item.name });
    }
  };

  // 5. 页面标题与激活菜单同步
  watch(
    [locale, () => route.path],
    () => {
      // 同步标题
      const titleKey = route.meta?.title as string;
      if (titleKey) document.title = t(titleKey);

      // 同步当前选中菜单
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
      class="bg-[var(--bg-card)]! border-r-[var(--border-color)]!"
    >
      <AppAside
        :is-collapsed="isCollapsed"
        :menu-options="menuOptions"
        v-model:active-key="activeKey"
        @toggle="isCollapsed = !isCollapsed"
      />
    </n-layout-sider>

    <n-layout class="bg-[var(--bg-body)]!">
      <n-layout-header
        bordered
        class="h-60px px-20px flex items-center justify-between bg-[var(--bg-card)]! border-b-[var(--border-color)]!"
      >
        <div class="flex items-center gap-12px">
          <slot name="header-left">
            <SearchBox
              :options="searchOptions"
              @click-item="handleSearchClick"
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
        class="bg-[var(--bg-body)]!"
        :native-scrollbar="false"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade-transform"
            mode="out-in"
          >
            <component
              :is="Component"
              :key="route.fullPath"
            />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
  /* 路由切换过渡 */
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-15px);
  }
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(15px);
  }

  /* 适配暗黑模式切换动画：在执行裁剪转场时禁用 Layout 自身的 CSS 过渡 */
  :global(html[style*='--ripple-radius']) {
    .n-layout,
    .n-layout-sider,
    .n-layout-header,
    .n-layout-content {
      transition: none !important;
      * {
        transition: none !important;
      }
    }
  }
</style>
