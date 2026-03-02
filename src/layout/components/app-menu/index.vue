<script setup lang="ts">
  import { gsap } from 'gsap';
  import { useI18n } from 'vue-i18n';

  defineOptions({
    name: 'AppMenu',
  });

  interface MenuItem {
    id: string | number;
    label: string; // 对应 i18n key 或直接文本
    icon?: string | Component;
    children?: MenuItem[];
    path?: string;
  }

  const props = defineProps({
    items: { type: Array as PropType<MenuItem[]>, default: () => [] },
    mode: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
    isCollapsed: { type: Boolean, default: false },
    indent: { type: Number, default: 16 }, // 纵向布局缩进
  });

  const { t } = useI18n();
  const expandedKeys = ref<Set<string | number>>(new Set());

  // 切换展开状态
  const toggleExpand = (item: MenuItem, event: Event) => {
    if (!item.children || props.isCollapsed) return;

    const el = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
    if (!el) return;

    if (expandedKeys.value.has(item.id)) {
      // 折叠动画
      gsap.to(el, {
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          expandedKeys.value.delete(item.id);
        },
      });
    } else {
      expandedKeys.value.add(item.id);
      nextTick(() => {
        // 展开动画：自动计算高度
        gsap.fromTo(el, { height: 0 }, { height: 'auto', duration: 0.4, ease: 'back.out(1.2)' });
      });
    }
  };

  // 监听伸缩状态，收起时清空展开项
  watch(
    () => props.isCollapsed,
    (val) => {
      if (val) expandedKeys.value.clear();
    },
  );
</script>

<template>
  <div :class="['app-menu', `is-${mode}`, { 'is-collapsed': isCollapsed }]">
    <div
      v-for="item in items"
      :key="item.id"
      class="menu-node"
    >
      <div
        class="menu-item"
        @click="toggleExpand(item, $event)"
        :title="isCollapsed ? t(item.label) : ''"
      >
        <div class="menu-icon-box">
          <component
            v-if="item.icon"
            :is="item.icon || 'i-ep-menu'"
            class="menu-icon"
          />
          <i-ep-menu
            v-else
            class="menu-icon"
          />
        </div>

        <transition name="fade">
          <span
            v-if="!isCollapsed"
            class="menu-label"
          >
            {{ t(item.label) }}
          </span>
        </transition>

        <i-ep-arrow-right
          v-if="item.children && !isCollapsed"
          :class="['arrow-icon', { 'is-rotated': expandedKeys.has(item.id) }]"
        />
      </div>

      <div
        v-if="item.children"
        class="sub-menu-wrapper"
        v-show="expandedKeys.has(item.id) && !isCollapsed"
      >
        <AppMenu
          :items="item.children"
          :mode="mode"
          :is-collapsed="isCollapsed"
          :style="{ paddingLeft: `${indent}px` }"
        />
      </div>

      <div
        v-if="item.children && isCollapsed"
        class="collapsed-popup"
      >
        <div
          v-for="child in item.children"
          :key="child.id"
          class="popup-item"
        >
          {{ t(child.label) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .app-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &.is-horizontal {
      flex-direction: row;
      align-items: center;
      .sub-menu-wrapper {
        position: absolute;
        top: 100%;
        z-index: 100;
      }
    }

    .menu-node {
      position: relative;

      .menu-item {
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 12px;
        border-radius: 8px;
        cursor: pointer;
        color: var(--sb-text-main);
        transition:
          background 0.3s,
          color 0.3s;
        white-space: nowrap;

        &:hover {
          background-color: var(--sb-primary-light);
          color: var(--sb-primary);
        }

        .menu-icon-box {
          width: 24px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .menu-label {
          margin-left: 12px;
          font-size: 14px;
          flex: 1;
        }

        .arrow-icon {
          font-size: 12px;
          transition: transform 0.3s ease;
          &.is-rotated {
            transform: rotate(90deg);
          }
        }
      }
    }

    // 伸缩状态下的特殊处理
    &.is-collapsed {
      width: 100%;
      .menu-item {
        justify-content: center;
        padding: 0;
        .menu-label,
        .arrow-icon {
          display: none;
        }
      }

      // 悬浮显示逻辑
      .menu-node:hover .collapsed-popup {
        display: block;
        opacity: 1;
        transform: translateX(0);
      }
    }

    .sub-menu-wrapper {
      overflow: hidden; // 必须设置，供 GSAP 动画裁剪
    }

    .collapsed-popup {
      display: none;
      position: absolute;
      left: 100%;
      top: 0;
      margin-left: 12px;
      background: var(--sb-bg-item);
      border: 1px solid var(--sb-border);
      border-radius: 8px;
      box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
      padding: 8px;
      z-index: 200;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

      .popup-item {
        padding: 8px 16px;
        white-space: nowrap;
        font-size: 13px;
        border-radius: 4px;
        &:hover {
          background: var(--sb-primary-light);
          color: var(--sb-primary);
        }
      }
    }
  }

  // 文字渐隐过渡
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
