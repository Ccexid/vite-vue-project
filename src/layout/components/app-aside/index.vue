<script setup lang="ts">
  // 接收父组件传递的状态
  defineProps({
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['toggle']);
</script>

<template>
  <aside
    class="app-layout-aside"
    :class="{ 'is-collapsed': isCollapsed }"
  >
    <div class="aside-header">
      <span
        v-if="!isCollapsed"
        class="logo-text"
      >
        管理系统
      </span>
      <img
        v-else
        src="@/assets/vue.svg"
        alt="logo"
      />
    </div>

    <div class="aside-content">
      <slot>
        <div
          v-for="value in 100"
          :key="value"
        >
          <span>菜单项 {{ value }}</span>
        </div>
      </slot>
    </div>

    <div class="aside-footer">
      <div
        @click="emit('toggle')"
        class="toggle-btn"
      >
        <i-ep-fold v-if="!isCollapsed" />
        <i-ep-expand v-else />
      </div>
    </div>
  </aside>
</template>

<style lang="less" scoped>
  .app-layout-aside {
    display: flex;
    flex-direction: column;
    width: 240px; // 默认宽度
    height: 100%;
    background-color: var(--sb-bg-item);
    border-right: 1px solid var(--sb-border);
    transition: width 0.3s cubic-bezier(0.2, 0, 0, 1); // 伸缩过渡动画
    overflow: hidden;

    // 当类名被激活时的宽度
    &.is-collapsed {
      width: 64px;
    }

    .aside-header {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      white-space: nowrap;
    }

    .aside-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .aside-footer {
      padding: 15px;
      border-top: 1px solid var(--sb-border);
      cursor: pointer;
      text-align: center;
    }
  }
</style>
