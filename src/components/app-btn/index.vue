<script setup lang="ts">
import type { AppBtnProps } from '@/types/app-btn';

  // 引入 Reka UI 的基础原始组件

  const props = withDefaults(defineProps<AppBtnProps>(), {
    as: 'button', // 默认作为 button 渲染
    type: 'default',
    size: 'normal',
    nativeType: 'button',
  });

  const btnKlass = computed(() => [
    'app-btn-reka',
    `app-btn-reka--${props.type}`,
    `app-btn-reka--${props.size}`,
    {
      'is-disabled': props.disabled || props.loading,
      'is-loading': props.loading,
      'is-plain': props.plain,
      'is-round': props.round,
      'is-circle': props.circle,
    },
  ]);
</script>

<template>
  <button
    :type="nativeType"
    :aria-disabled="disabled || loading"
    :disabled="disabled || loading"
    :class="btnKlass"
    aria-label="button"
  >
    <template v-if="loading">
      <div class="loading-box"><i-ep-loading /></div>
    </template>

    <span
      v-if="$slots.default"
      class="btn-content"
    >
      <slot></slot>
    </span>
  </button>
</template>

<style lang="less" scoped>
  .app-btn-reka {
    // 保持你原有的核心布局样式
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    cursor: pointer;
    background-color: var(--sb-bg-item);
    border: 1px solid var(--sb-border);
    color: var(--sb-text-main);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    border-radius: 4px;
    outline: none;
    user-select: none;

    // Reka UI (Radix) 风格的 Focus 状态（原生感增强）
    &:focus-visible {
      box-shadow:
        0 0 0 2px var(--sb-bg-layout),
        0 0 0 4px var(--sb-primary);
    }

    /* 复用你原有的类型生成逻辑 */
    .generate-type-style(@type) {
      @var-name: ~'--sb-@{type}';
      @bg-light: ~'--sb-@{type}-light';

      &--@{type} {
        background-color: var(@var-name);
        border-color: var(@var-name);
        color: var(--sb-text-white);

        &.is-plain {
          background-color: var(@bg-light);
          border-color: var(@var-name);
          color: var(@var-name);

          &:hover:not(.is-disabled) {
            background-color: var(@var-name);
            color: var(--sb-text-white);
          }
        }
      }
    }

    .generate-type-style(primary);
    .generate-type-style(success);
    .generate-type-style(warning);
    .generate-type-style(danger);
    .generate-type-style(info);

    /* 状态控制与交互动效 */
    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;
      transform: none !important;
    }

    // 结合你之前的 Native 反馈感
    &:active:not(.is-disabled) {
      transform: scale(0.96);
    }

    /* 尺寸适配保持不变 */
    &--large {
      height: 40px;
      padding: 12px 20px;
    }
    &--normal {
      height: 32px;
      padding: 8px 15px;
    }
    &--small {
      height: 24px;
      padding: 5px 11px;
      font-size: 12px;
    }

    &.is-round {
      border-radius: 20px;
    }
    &.is-circle {
      border-radius: 50%;
      padding: 8px;
      width: 32px;
    }

    .loading-box {
      margin-right: 6px;
      svg {
        animation: rotating 2s linear infinite;
      }
    }
  }

  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
