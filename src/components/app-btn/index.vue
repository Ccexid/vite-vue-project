<script setup lang="ts">
  import { computed, type PropType } from 'vue';

  type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  type ButtonNativeType = 'button' | 'submit' | 'reset';
  type ButtonSize = 'large' | 'normal' | 'small';

  const props = defineProps({
    type: { type: String as PropType<ButtonType>, default: 'default' },
    size: { type: String as PropType<ButtonSize>, default: 'normal' },
    nativeType: { type: String as PropType<ButtonNativeType>, default: 'button' },
    disabled: Boolean,
    loading: Boolean,
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
  });

  const btnKlass = computed(() => [
    'el-btn-custom',
    `el-btn-custom--${props.type}`,
    `el-btn-custom--${props.size}`,
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
    :type="props.nativeType"
    :disabled="props.disabled || props.loading"
    :class="btnKlass"
  >
    <template v-if="props.loading">
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
  .el-btn-custom {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    cursor: pointer;
    background-color: var(--sb-bg-item);
    border: 1px solid var(--sb-border);
    color: var(--sb-text-main);
    transition: 0.15s;
    font-weight: 500;
    border-radius: 4px;

    /* 类型与 Plain 组合样式：通过嵌套提升优先级 */
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

    /* 应用样式 */
    .generate-type-style(primary);
    .generate-type-style(success);
    .generate-type-style(warning);
    .generate-type-style(danger);
    .generate-type-style(info);

    &--default.is-plain:hover:not(.is-disabled) {
      color: var(--sb-primary);
      border-color: var(--sb-primary);
    }

    /* 尺寸适配 */
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

    /* 状态控制 */
    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;
      transform: none !important;
    }
    &:active:not(.is-disabled) {
      transform: scale(0.97);
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

  /* 解决切换主题时的颜色滞后问题 */
  :global(html[style*='--ripple-radius']) .el-btn-custom {
    transition: none !important;
  }
</style>
