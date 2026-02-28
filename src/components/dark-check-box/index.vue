<script setup lang="ts">
  import { gsap } from 'gsap';
  import { useDark } from '@vueuse/core';

  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  });

  const iconTrackRef = ref<HTMLDivElement | null>(null);

  const handleToggle = (event: MouseEvent) => {
    const willBeDark = !isDark.value;
    const { clientX, clientY } = event;

    // 1. 开关内部滚动动画
    gsap.to(iconTrackRef.value, {
      x: willBeDark ? 28 : 0,
      rotation: willBeDark ? 360 : 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
    });

    // 2. 扩散动画
    const html = document.documentElement;
    const maxRadius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY),
    );

    html.style.setProperty('--ripple-x', `${clientX}px`);
    html.style.setProperty('--ripple-y', `${clientY}px`);

    gsap.to(html, {
      '--ripple-radius': `${maxRadius}px`,
      duration: 0.7,
      ease: 'power2.inOut',
      onStart: () => {
        isDark.value = willBeDark;
      },
      onComplete: () => {
        // --- 关键修复：直接移除 style 属性中的变量 ---
        // 这样 CSS 中的 html[style*="--ripple-radius"] 选择器就会失效
        // 从而让 clip-path 恢复为默认的 none 或全屏状态
        html.style.removeProperty('--ripple-radius');
        html.style.removeProperty('--ripple-x');
        html.style.removeProperty('--ripple-y');
      },
    });
  };
</script>

<template>
  <div
    class="theme-switch-bar"
    @click="handleToggle"
  >
    <div
      ref="iconTrackRef"
      class="icon-track"
    >
      <div class="icon-ball">
        <i-ep-sunny
          v-show="!isDark"
          class="theme-icon sun"
        />
        <i-ep-moon
          v-show="isDark"
          class="theme-icon moon"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  /* 按钮样式保持您的原有配置 */
  .theme-switch-bar {
    width: 58px;
    height: 30px;
    background-color: var(--sb-bg-item);
    border: 1px solid var(--sb-border);
    border-radius: 30px;
    padding: 2px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

    .icon-track {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform;

      .icon-ball {
        width: 24px;
        height: 24px;
        background: var(--sb-btn-ball, #fff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        transition: background-color 0.3s;

        .theme-icon {
          font-size: 16px;
          flex-shrink: 0;
          &.sun {
            color: #ff9800;
          }
          &.moon {
            color: #f1c40f;
          }
        }
      }
    }
  }
</style>
