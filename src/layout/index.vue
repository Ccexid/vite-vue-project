<script setup lang="ts">
  // 这里可以添加控制侧边栏折叠的逻辑
  import { ref } from 'vue';

  const isCollapsed = ref(false);
  const toggleAside = () => {
    isCollapsed.value = !isCollapsed.value;
  };
</script>

<template>
  <section
    class="app-layout"
    :class="{ 'is-collapsed': isCollapsed }"
  >
    <aside class="app-layout-aside">
      <div class="aside-header">
        <span
          v-if="!isCollapsed"
          class="logo-text"
        >
          管理系统
        </span>
        <img
          v-else
          src="@/assets/vue.svg"
          alt="logo"
        />
      </div>

      <div class="aside-content">
        <div
          v-for="value in 100"
          :key="value"
        >
          <span>{{ value }}</span>
        </div>
      </div>

      <div class="aside-footer">
        <div
          @click="toggleAside"
          class="toggle-btn"
        >
          <template v-if="!isCollapsed">
            <i-ep-fold />
          </template>
          <template v-else>
            <i-ep-expand />
          </template>
        </div>
      </div>
    </aside>

    <section class="app-layout-container">
      <header class="app-layout-header">
        <div class="header-left">
          <slot name="header-left"></slot>
        </div>
        <div class="header-right">
          <slot name="header-right"></slot>
        </div>
      </header>

      <main class="app-main">
        <div class="app-content-wrapper">
          <router-view v-slot="{ Component }">
            <transition
              name="fade-transform"
              mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

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
    overflow: hidden;
    background-color: var(--sb-bg-layout); // 引用全局背景变量
    color: var(--sb-text-main);

    // 侧边栏
    &-aside {
      display: flex;
      flex-direction: column;
      width: 240px;
      height: 100%;
      background-color: var(--sb-bg-item); // 引用全局项背景
      border-right: 1px solid var(--sb-border);
      box-shadow: var(--sb-item-shadow);
      transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
      z-index: 100;

      .aside-header {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        font-weight: bold;
        font-size: 18px;
      }

      .aside-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .aside-footer {
        padding: 15px;
        border-top: 1px solid var(--sb-border);
        display: flex;
        justify-content: center;
      }
    }

    // 折叠状态样式
    &.is-collapsed {
      .app-layout-aside {
        width: 64px;
      }
      .logo-text {
        display: none;
      }
    }

    // 右侧容器
    &-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
    }

    // 顶栏
    &-header {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      background-color: var(--sb-bg-item);
      border-bottom: 1px solid var(--sb-border);
    }

    // 主内容区
    .app-main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px;
      display: flex;
      flex-direction: column;
      background-color: var(--sb-bg-layout);

      .app-content-wrapper {
        flex: 1;
      }
    }

    .app-footer {
      padding: 20px 0;
      text-align: center;
      color: var(--sb-text-muted);
      font-size: 12px;
    }
  }

  // 页面切换动画
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: all 0.3s;
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
