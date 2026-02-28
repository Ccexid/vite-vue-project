<script setup lang="ts"></script>
<template>
  <button
    type="button"
    aria-disabled="false"
    class="app-btn"
  >
    <slot></slot>
  </button>
</template>
<style lang="less" scoped>
  .app-btn {
    // 1. 布局与尺寸
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0 15px;
    height: 32px;
    min-width: 64px;

    // 2. 文本属性
    color: var(--sb-text-main); // 引用全局变量
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-align: center;

    // 3. 装饰属性
    background-color: var(--sb-bg-item); // 引用全局变量
    border: 1px solid var(--sb-border); // 引用全局变量
    border-radius: 4px;
    box-sizing: border-box;

    // 4. 交互控制
    cursor: pointer;
    outline: none;
    appearance: none;
    user-select: none;
    vertical-align: middle;

    // 【重要修改】禁用全局 transition，仅对特定交互属性启用过渡
    // 避免在主题切换动画过程中出现颜色延迟滞后
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease,
      transform 0.1s ease;

    // 5. 状态反馈
    &:hover {
      background-color: var(--sb-primary); //
      border-color: var(--sb-primary); //
      color: var(--sb-text-white); //
      box-shadow: 0 4px 12px rgba(84, 104, 255, 0.3);
    }

    &:active {
      // 点击反馈保持物理缩放
      filter: brightness(0.9);
      transform: scale(0.96);
    }

    // 6. 禁用状态
    &[aria-disabled='true'],
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background-color: var(--sb-bg-dialog) !important; // 使用变量
      border-color: var(--sb-border) !important; // 使用变量
      color: var(--sb-text-muted) !important; // 使用变量
      transform: none !important;
      box-shadow: none !important;
    }
  }

  // 针对主题切换过程中的优化：当 html 正在执行 ripple 动画时，强制禁用 transition
  :global(html[style*='--ripple-radius']) .app-btn {
    transition: none !important;
  }
</style>

