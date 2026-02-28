<script setup lang="ts">
  import { gsap } from 'gsap';
  import { useDark } from '@vueuse/core';
  import { ref } from 'vue';

  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  });

  const iconTrackRef = ref<HTMLDivElement | null>(null);
  const isAnimating = ref(false);

  const handleToggle = (event: MouseEvent) => {
    if (isAnimating.value) return;

    const willBeDark = !isDark.value;
    const { clientX, clientY } = event;
    const html = document.documentElement;

    const maxRadius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY),
    );

    // 1. 图标滚动动画
    gsap.to(iconTrackRef.value, {
      x: willBeDark ? 28 : 0,
      rotation: willBeDark ? 360 : 0,
      duration: 0.5,
      ease: 'back.out(1.5)',
    });

    isAnimating.value = true;
    html.style.setProperty('--ripple-x', `${clientX}px`);
    html.style.setProperty('--ripple-y', `${clientY}px`);

    const tl = gsap.timeline({
      onComplete: () => {
        html.style.removeProperty('--ripple-radius');
        html.style.removeProperty('--ripple-x');
        html.style.removeProperty('--ripple-y');
        isAnimating.value = false;
      },
    });

    if (willBeDark) {
      // --- 明亮 -> 黑夜：从小圆扩大 ---
      // 逻辑：立即切到黑夜，但 clip-path 从 0 开始扩大，黑色逐渐显现
      tl.fromTo(
        html,
        { '--ripple-radius': '0px' },
        {
          '--ripple-radius': `${maxRadius}px`,
          duration: 0.8,
          ease: 'power2.inOut',
          onStart: () => {
            isDark.value = true;
          },
        },
      );
    } else {
      // --- 黑夜 -> 明亮：从全屏收缩 ---
      // 逻辑：为了防止背景直接变白，我们利用“反向裁剪”
      // 动画过程中保持 isDark = true，通过把黑色“吸走”来露出白底
      tl.fromTo(
        html,
        { '--ripple-radius': `${maxRadius}px` },
        {
          '--ripple-radius': '0px',
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            // 只有当黑色收缩到消失时，才正式切换 data-theme 属性
            isDark.value = false;
          },
        },
      );
    }
  };
</script>

<template>
  <div
    class="theme-switch-bar"
    :class="{ 'is-animating': isAnimating }"
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

    // 动画期间禁用鼠标手势
    &.is-animating {
      cursor: wait;
    }

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
