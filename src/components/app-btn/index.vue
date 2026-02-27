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
    padding: 0 15px; // 配合固定高度使用左右 padding
    height: 32px;
    min-width: 64px; // 保证短文本按钮的审美比例

    // 2. 文本属性
    color: var(--sb-text-main); // 引用语义化变量
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-align: center;

    // 3. 装饰属性 (适配黑夜模式)
    background-color: var(--sb-bg-item); // 按钮背景跟随列表项色值
    border: 1px solid var(--sb-border);   // 引用统一边框色
    border-radius: 4px;
    box-sizing: border-box;

    // 4. 交互控制
    cursor: pointer;
    outline: none;
    appearance: none;
    user-select: none;
    vertical-align: middle;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1); // 优化过渡曲线

    // 5. 状态反馈
    &:hover {
      background-color: var(--sb-primary);
      border-color: var(--sb-primary);
      color: var(--sb-text-white);
      box-shadow: 0 4px 12px rgba(84, 104, 255, 0.3); // 悬停浮起感
    }

    &:active {
      filter: brightness(0.9); // 点击时自动变暗 10%，适配所有背景色
      transform: scale(0.96);  // 增强点击的物理反馈
    }

    // 6. 禁用状态 (对应组件 aria-disabled 属性)
    &[aria-disabled='true'],
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      background-color: var(--sb-bg-dialog) !important; // 禁用时使用对话框背景色
      border-color: var(--sb-border) !important;
      color: var(--sb-text-muted) !important;
      transform: none !important;
      box-shadow: none !important;
    }
  }
</style>
