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
  // 基础颜色
  @btn-primary-color: #5468ff;
  @btn-text-color: #1c1e21;
  @btn-bg-color: #ffffff;
  @btn-border-color: #ebedf0;

  // 交互颜色
  @btn-hover-bg: @btn-primary-color;
  @btn-hover-text: #ffffff;
  @btn-active-bg: darken(@btn-primary-color, 5%); // 点击时加深 5%

  // 辅助
  @btn-disabled-opacity: 0.6;
  @btn-transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  @btn-radius: 4px;
  .app-btn {
    // 1. 布局属性
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 8px 15px;
    height: 32px;

    // 2. 文本属性
    color: @btn-text-color;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-align: center;

    // 3. 装饰属性
    background-color: @btn-bg-color;
    border: 1px solid @btn-border-color;
    border-radius: @btn-radius;
    box-sizing: border-box;

    // 4. 交互控制
    cursor: pointer;
    outline: none;
    appearance: none;
    user-select: none;
    vertical-align: middle;
    transition: @btn-transition;

    // 悬停状态
    &:hover {
      background-color: @btn-hover-bg;
      border-color: @btn-hover-bg;
      color: @btn-hover-text;
    }

    // 点击/激活状态 (解决你之前提到的视觉反馈问题)
    &:active {
      background-color: @btn-active-bg;
      border-color: @btn-active-bg;
      transform: scale(0.98); // 轻微缩放增加点击感
    }

    // 禁用状态处理 (对应 template 中的 aria-disabled)
    &[aria-disabled='true'],
    &:disabled {
      cursor: not-allowed;
      opacity: @btn-disabled-opacity;
      background-color: @btn-border-color;
      &:hover {
        // 禁用时防止触发 hover 变色
        background-color: @btn-border-color;
        color: @btn-text-color;
      }
    }
  }
</style>
