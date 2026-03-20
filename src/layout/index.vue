<script setup lang="ts">
  import BaseHeader from './base-header/index.vue';
  import { useWindowScroll } from '@vueuse/core';

  defineOptions({
    name: 'Layout',
  });

  // 获取窗口滚动高度
  const { y } = useWindowScroll();

  // 定义触发阈值
  const SCROLL_THRESHOLD = 64;

  // 动态计算 Header 的 Class
  const headerClass = computed(() => {
    return y.value >= SCROLL_THRESHOLD
      ? 'fixed z-1002 top-0 left-0 bg-white shadow-sm'
      : 'bg-white'; // 初始状态，根据需求调整
  });
</script>
<template>
  <div class="relative flex w-full min-h-full">
    <BaseHeader :class="['max-w-2560px text-12px w-full transition-all duration-300', headerClass]">
      <template #logo>
        <RouterLink
          to="/"
          class="logo"
          target="_blank"
          alt="logo"
        />
      </template>
      <template #left-nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </template>
    </BaseHeader>
    <main
      class="absolute top-64px left-0 w-full mx-auto flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in"
    >
      <RouterView v-slot="{ Component, route }">
        <template v-if="Component">
          <Transition
            mode="out-in"
            name="fade-transform"
          >
            <Component
              :key="route.fullPath"
              :is="Component"
            />
          </Transition>
        </template>
      </RouterView>
    </main>
  </div>
</template>
<style lang="less" scoped>
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-transform-enter-from,
  .fade-transform-leave-to {
    opacity: 0;
  }

  .logo {
    display: block;
    width: 92px;
    height: 46px;
    background: url('@/assets/vue.svg') no-repeat center 7px;
  }
</style>
