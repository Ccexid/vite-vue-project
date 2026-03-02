<script setup lang="ts">
  import { useStorage } from '@vueuse/core';
  import AppAside from '@/layout/components/app-aside/index.vue';

  const isCollapsed = useStorage('sidebar-collapsed', false);
  const toggleAside = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>

<template>
  <section class="app-layout">
    <AppAside
      :is-collapsed="isCollapsed"
      @toggle="toggleAside"
    />

    <section class="app-layout-container">
      <header class="app-layout-header">
        <slot name="header-left"></slot>
        <slot name="header-right">
          <DarkCheckBox />
        </slot>
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

        <footer class="app-footer">
          <p>© 2024 Your Company. All rights reserved.</p>
        </footer>
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
      flex: 1; // 自动填充剩余空间
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &-header {
      height: 60px;
      background-color: var(--sb-bg-item);
      border-bottom: 1px solid var(--sb-border);
    }

    .app-main {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
  }
</style>
