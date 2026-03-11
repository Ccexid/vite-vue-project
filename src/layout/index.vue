<script setup lang="ts"></script>

<template>
  <NLayout
    ref="layoutRef"
    :native-scrollbar="false"
    position="absolute"
    content-class="main-layout-container"
  >
    <NLayoutHeader content-class="layout-header">
      <div class="header-content">
        <div class="logo">颐和园路</div>

        <NButton
          quaternary
          circle
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
