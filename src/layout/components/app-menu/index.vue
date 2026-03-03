<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import type { MenuItem } from '@/types/app-menu';
  import { gsap } from 'gsap';
  import { useI18n } from 'vue-i18n';
  
  defineOptions({ name: 'AppMenu' });

  const props = defineProps({
    items: { type: Array as PropType<MenuItem[]>, default: () => [] },
    isCollapsed: { type: Boolean, default: false },
    indent: { type: Number, default: 16 },
    isFloating: { type: Boolean, default: false },
  });

  const { t } = useI18n();
  const router = useRouter();
  const expandedKeys = ref<Set<string | number>>(new Set());

  // 用于 Teleport 的定位和显示状态
  const activeItemId = ref<string | number | null>(null);
  const popupStyle = ref({ top: '0px', left: '0px', bottom: 'auto' });

  // 计时器，用于处理鼠标从菜单项移动到弹出层之间的间隙
  let leaveTimer: ReturnType<typeof setTimeout> | null = null;

  const clearLeaveTimer = () => {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
  };

  /**
   * 核心定位与动画逻辑 (封装供悬停和点击共用)
   */
  const openPopup = (item: MenuItem, target: HTMLElement) => {
    clearLeaveTimer();
    activeItemId.value = item.id;

    nextTick(() => {
      const popup = document.querySelector(`.popup-${item.id}`) as HTMLElement;
      if (!popup) return;

      const rect = target.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const popupHeight = popup.offsetHeight || item.children!.length * 40 + 50;

      const left = rect.right + 8;
      const isBottomGapSmall = windowHeight - rect.top < popupHeight;

      if (isBottomGapSmall) {
        popupStyle.value = {
          left: `${left}px`,
          top: 'auto',
          bottom: `${windowHeight - rect.bottom}px`,
        };
      } else {
        popupStyle.value = {
          left: `${left}px`,
          top: `${rect.top}px`,
          bottom: 'auto',
        };
      }

      gsap.fromTo(
        popup,
        { opacity: 0, x: -15, y: isBottomGapSmall ? 20 : -10 },
        { opacity: 1, x: 0, y: 0, duration: 0.4, ease: 'back.out(1.7)' },
      );
    });
  };

  const handleMouseEnter = (item: MenuItem, event: MouseEvent) => {
    if (!props.isCollapsed || !item.children || props.isFloating) return;
    openPopup(item, event.currentTarget as HTMLElement);
  };

  const handleMouseLeave = (item: MenuItem, _event: MouseEvent) => {
    if (!props.isCollapsed || !item.children || props.isFloating) return;

    leaveTimer = setTimeout(() => {
      const popup = document.querySelector(`.popup-${item.id}`) as HTMLElement;
      if (!popup) {
        activeItemId.value = null;
        return;
      }

      gsap.to(popup, {
        opacity: 0,
        x: -15,
        duration: 0.2,
        onComplete: () => {
          activeItemId.value = null;
          leaveTimer = null;
        },
      });
    }, 100);
  };

  /**
   * 点击事件处理：兼容折叠状态
   */
  const handleItemClick = (item: MenuItem, event: MouseEvent) => {
    // 1. 如果有子节点且处于折叠状态：点击触发浮层（类似悬停）
    if (item.children && props.isCollapsed && !props.isFloating) {
      openPopup(item, event.currentTarget as HTMLElement);
      return;
    }

    // 2. 正常展开/折叠逻辑 (非折叠模式)
    if (item.children) {
      const el = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
      if (!el) return;

      if (expandedKeys.value.has(item.id)) {
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
          gsap.fromTo(el, { height: 0 }, { height: 'auto', duration: 0.4, ease: 'power2.out' });
        });
      }
    } else {
      // 3. 无子节点：执行路由跳转或其他逻辑
      console.log('Navigate to:', item.path);
      router.push(item.path || '/');
    }
  };

  onUnmounted(() => clearLeaveTimer());
</script>

<template>
  <div :class="['app-menu', { 'is-collapsed': isCollapsed, 'is-floating': isFloating }]">
    <div
      v-for="item in items"
      :key="item.id"
      class="menu-node"
      @mouseenter="handleMouseEnter(item, $event)"
      @mouseleave="handleMouseLeave(item, $event)"
    >
      <div
        class="menu-item"
        @click="handleItemClick(item, $event)"
      >
        <div class="menu-icon-box">
          <component
            :is="item.icon || 'i-ep-menu'"
            class="menu-icon"
          />
        </div>
        <span
          v-if="!isCollapsed || isFloating"
          class="menu-label"
        >
          {{ t(item.label) }}
        </span>
        <i-ep-arrow-right
          v-if="item.children && (!isCollapsed || isFloating)"
          :class="['arrow-icon', { 'is-rotated': expandedKeys.has(item.id) }]"
        />
      </div>

      <div
        v-if="item.children && !isCollapsed"
        class="sub-menu-wrapper"
        v-show="expandedKeys.has(item.id)"
      >
        <AppMenu
          :items="item.children"
          :is-collapsed="false"
          :indent="indent"
        />
      </div>

      <Teleport
        to="body"
        v-if="item.children && isCollapsed && !isFloating && activeItemId === item.id"
      >
        <div
          :class="['collapsed-popup', `popup-${item.id}`]"
          :style="popupStyle"
          @mouseenter="clearLeaveTimer"
          @mouseleave="handleMouseLeave(item, $event)"
        >
          <div class="popup-inner">
            <div class="popup-header">{{ t(item.label) }}</div>
            <AppMenu
              :items="item.children"
              :is-collapsed="false"
              :is-floating="true"
              :indent="12"
            />
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .app-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;

    .menu-item {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 12px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--sb-text-main);
      white-space: nowrap;
      transition: background 0.3s;
      &:hover {
        background-color: var(--sb-primary-light);
        color: var(--sb-primary);
      }
      .menu-icon-box {
        width: 24px;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
        font-size: 18px;
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

    &.is-collapsed:not(.is-floating) {
      .menu-item {
        justify-content: center;
        padding: 0;
      }
    }
  }

  .collapsed-popup {
    position: fixed;
    z-index: 9999;
    pointer-events: auto;
    .popup-inner {
      background: var(--sb-bg-item);
      border: 1px solid var(--sb-border);
      border-radius: 8px;
      box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.15);
      padding: 8px;
      min-width: 180px;
      max-height: 85vh;
      overflow-y: auto;
      .popup-header {
        padding: 8px 12px;
        font-weight: bold;
        font-size: 12px;
        color: var(--sb-text-muted);
        border-bottom: 1px solid var(--sb-border);
        margin-bottom: 8px;
      }
    }
  }

  .sub-menu-wrapper {
    overflow: hidden;
  }
</style>
