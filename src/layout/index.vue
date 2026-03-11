<script setup lang="ts">
  import { ref, type ComponentPublicInstance } from 'vue';
  import { useThemeRipple } from '@/hooks/useThemeRipple';

  const layoutRef = ref<ComponentPublicInstance | null>(null);

  // 使用封装好的 Hook
  const { isDark, toggleTheme } = useThemeRipple(layoutRef);
</script>

<template>
  <n-layout
    ref="layoutRef"
    embedded
    position="absolute"
    content-class="layout-container"
  >
    <div class="content-layer">
      <div
        class="switch-wrapper"
        @click.stop="toggleTheme($event)"
      >
        <n-switch
          :value="isDark"
          size="medium"
          style="pointer-events: none"
        >
          <template #checked-icon><i-line-md-moon-alt-to-sunny-outline-loop-transition /></template>
          <template #unchecked-icon><i-line-md-moon-alt /></template>
        </n-switch>
      </div>
    </div>
  </n-layout>
</template>

<style lang="less" scoped>
  .layout-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .content-layer {
    position: relative;
    z-index: 10;
    height: 100%;
  }
  .switch-wrapper {
    display: inline-block;
    cursor: pointer;
    padding: 24px;
  }
</style>
