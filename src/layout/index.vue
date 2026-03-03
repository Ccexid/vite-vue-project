<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { useStorage } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';

  // 导入你的业务组件
  import AppAside from '@/layout/components/app-aside/index.vue';
  import { watch } from 'vue';

  const route = useRoute();
  const { locale, t } = useI18n();

  // 1. 侧边栏折叠状态 (继续使用 useStorage 保持持久化)
  const isCollapsed = useStorage('sidebar-collapsed', false);

  // 3. 标题同步逻辑 (保留)
  const updateTitle = () => {
    const titleKey = route.meta?.title as string;
    if (titleKey) document.title = t(titleKey);
  };
  watch([locale, () => route.path], () => updateTitle(), { immediate: true });
</script>

<template>
  <n-layout
    has-sider
    class="h-full w-full"
  >
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="isCollapsed"
      show-trigger
      @collapse="isCollapsed = true"
      @expand="isCollapsed = false"
      class="bg-[var(--sb-bg-item)]! border-r-[var(--sb-border)]!"
    >
      <div class="h-full flex flex-col">
        <div class="h-60px flex items-center justify-center border-b border-[var(--sb-border)]">
          <div class="w-32px h-32px bg-[var(--sb-primary)] rounded-8px" />
        </div>

        <div class="flex-1 overflow-y-auto">
          <slot name="aside">
            <AppAside :is-collapsed="isCollapsed" />
          </slot>
        </div>
      </div>
    </n-layout-sider>

    <n-layout>
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
  // 路由过渡动画保持不变
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
