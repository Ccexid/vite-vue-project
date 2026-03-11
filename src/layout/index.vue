<script setup lang="ts">
  /**
   * 1. 注入来自 App.vue 的全局切换函数
   * 第二个参数是默认值，防止注入失败时报错
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleTheme = inject<(event: MouseEvent) => void>('toggleTheme', (_event) => {
    // 降级处理：如果没有注入成功，至少能切换类名
    document.documentElement.classList.toggle('dark');
  });
</script>

<template>
  <NLayout
    ref="layoutRef"
    :native-scrollbar="false"
    position="absolute"
    content-class="main-layout-container"
  >
    <NLayoutHeader
      bordered
      content-class="layout-header"
    >
      <div class="header-content">
        <div class="logo">颐和园路</div>

        <NButton
          quaternary
          circle
          @click="toggleTheme($event)"
        >
          <template #icon>
            <span>🌓</span>
          </template>
        </NButton>
      </div>
    </NLayoutHeader>

    <NLayoutContent content-style="h-full">
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="fade-slide"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="route.fullPath"
          />
        </Transition>
      </RouterView>
    </NLayoutContent>
  </NLayout>
</template>

<style lang="less" scoped>
  .main-layout-container {
    // 满足 375px 最小尺寸需求
    min-width: 375px;
    width: 100%;
    height: 100%;

    .layout-header {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 16px;

      .header-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  /* 切换页面的平滑动画 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.3s ease;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-10px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
</style>
