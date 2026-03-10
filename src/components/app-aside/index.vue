<script setup lang="ts">
  import type { MenuOption } from 'naive-ui';

  interface Props {
    isCollapsed: boolean;
    menuOptions: MenuOption[];
    activeKey: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    isCollapsed: false,
    menuOptions: () => [],
    activeKey: '',
  });

  const emit = defineEmits(['toggle', 'update:activeKey']);

  // 响应式处理折叠状态
  const collapsed = computed(() => props.isCollapsed);

  // 菜单更新回调
  const handleUpdateValue = (key: string, item: MenuOption) => {
    emit('update:activeKey', key, item);
  };
</script>

<template>
  <div class="aside-inner-wrapper flex flex-col h-full overflow-hidden">
    <div class="aside-header flex items-center h-72px px-16px flex-shrink-0">
      <div class="logo-wrapper flex items-center gap-12px">
        <div class="logo-icon w-32px h-32px flex-shrink-0">
          <img
            src="@/assets/vue.svg"
            alt="logo"
            class="w-full h-full"
          />
        </div>
        <Transition name="fade-fast">
          <span
            v-if="!collapsed"
            class="logo-text text-18px font-700 whitespace-nowrap overflow-hidden"
          >
            Gemini Admin
          </span>
        </Transition>
      </div>
    </div>

    <div class="aside-content flex-1 overflow-y-auto px-4px">
      <n-menu
        :value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :indent="20"
        @update:value="handleUpdateValue"
      />
    </div>

    <div class="aside-footer p-12px border-t border-[var(--sb-border)] flex-shrink-0">
      <button
        class="toggle-btn w-full h-40px flex items-center justify-center rounded-8px bg-[var(--sb-bg-layout)] text-[var(--sb-text-main)] hover:bg-[var(--sb-primary)] hover:text-white transition-all duration-300"
        @click="emit('toggle')"
      >
        <div class="icon-box text-18px">
          <i-ep-fold v-if="!collapsed" />
          <i-ep-expand v-else />
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .aside-inner-wrapper {
    background-color: transparent;
  }

  .logo-text {
    background: linear-gradient(120deg, var(--sb-primary), #42b883);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  /* 深度适配 Naive UI Tree 菜单样式 */
  :deep(.n-menu) {
    // 基础变量绑定自定义 CSS 变量
    --n-item-color-active: var(--sb-primary);
    --n-item-color-active-hover: var(--sb-primary);
    --n-item-text-color-active: var(--sb-primary);
    --n-item-icon-color-active: var(--sb-primary);
    --n-arrow-color-active: var(--sb-primary);

    // 选中的菜单项圆角与间距优化
    .n-menu-item-content {
      margin-bottom: 4px;
      border-radius: 8px;

      &.n-menu-item-content--selected {
        &::before {
          background-color: var(--sb-bg-item) !important;
        }
      }
    }
  }

  /* 动画补丁：配合 GSAP 暗黑模式转场 */
  :global(html[style*='--ripple-radius']) & {
    :deep(.n-menu-item-content),
    .toggle-btn,
    .logo-text {
      transition: none !important;
    }
  }

  .fade-fast-enter-active,
  .fade-fast-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-fast-enter-from,
  .fade-fast-leave-to {
    opacity: 0;
  }
</style>
