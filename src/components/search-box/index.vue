<script lang="ts" setup>
  import { debounce } from 'lodash-es';
  import { gsap } from 'gsap';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import { onClickOutside, useEventListener, useFocus, useScrollLock } from '@vueuse/core';
  import type { SearchItem } from '@/types/search-box';

  // ===================== 状态与 Refs =====================
  const isModalOpen = ref(false);
  const dialogRef = ref<HTMLDivElement | null>(null);
  const maskRef = ref<HTMLDivElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);
  const scrollerRef = ref();
  let activeTimeline: gsap.core.Timeline | null = null;

  // 使用 VueUse 管理输入框焦点
  const { focused } = useFocus(inputRef);
  // 使用 VueUse 管理 Body 滚动锁定，替代手动操作 style
  const isLocked = useScrollLock(document.body);

  // 统一动画配置
  const animConfig = {
    duration: 0.3,
    ease: 'power2.out',
    easeOut: 'power2.in',
    startScale: 0.9,
  };

  /**
   * 每个列表项的动画逻辑
   */
  const animateItemIn = (el: HTMLElement | null, index: number) => {
    if (!el) return;

    // 关键优化：使用 requestAnimationFrame 确保动画在浏览器下一帧执行，避免卡顿
    requestAnimationFrame(() => {
      gsap.killTweensOf(el);

      // 限制首屏动画数量，超过 10 个后的项目直接显示，不再执行位移动画以节省性能
      const isInitial = index < 10;
      if (!isInitial) {
        gsap.set(el, { x: 0, opacity: 1 });
        return;
      }

      const staggerDelay = index * 0.03; // 缩短延迟，提升响应感

      gsap.fromTo(
        el,
        { x: -15, opacity: 0 }, // 减小位移距离（从 -20 减为 -15）减少重绘区域
        {
          x: 0,
          opacity: 1,
          duration: 0.25, // 缩短持续时间
          delay: staggerDelay,
          ease: 'sine.out',
          force3D: true, // 强制 3D 加速
          clearProps: 'all', // 动画结束彻底清理所有行内样式
          overwrite: 'auto',
        },
      );
    });
  };

  const props = defineProps({
    options: {
      type: Array as PropType<SearchItem[]>,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '搜索',
    },
    teleportTo: {
      type: String,
      default: 'body',
    },
    zIndex: {
      type: Number,
      default: 1001,
    },
  });

  const emit = defineEmits<{
    (e: 'search', keyword: string): void;
    (e: 'click-item', item: SearchItem): void;
  }>();

  // ===================== 核心逻辑 =====================

  const debouncedSearch = debounce((value: string): void => {
    emit('search', value);
  }, 300);

  const handleClick = (item: SearchItem): void => {
    emit('click-item', item);
  };

  const handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    debouncedSearch(target.value);
  };

  const openModal = async () => {
    if (isModalOpen.value) return;
    isModalOpen.value = true;
    isLocked.value = true; // 锁定滚动
    await nextTick();

    if (activeTimeline) activeTimeline.kill();
    activeTimeline = gsap.timeline();

    activeTimeline.fromTo(maskRef.value, { opacity: 0 }, { opacity: 1, duration: 0.2 }).fromTo(
      dialogRef.value,
      {
        opacity: 0,
        scale: animConfig.startScale,
        y: 10,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: animConfig.duration,
        ease: animConfig.ease,
        onComplete: () => {
          focused.value = true; // 自动聚焦
          inputRef.value?.select();
        },
      },
      '-=0.1',
    );
  };

  const closeModal = () => {
    if (activeTimeline) activeTimeline.kill();
    emit('search', '');

    activeTimeline = gsap.timeline({
      onComplete: () => {
        isModalOpen.value = false;
        isLocked.value = false; // 解除锁定
      },
    });

    activeTimeline.to(dialogRef.value, {
      opacity: 0,
      scale: animConfig.startScale,
      y: 10,
      duration: 0.25,
      ease: animConfig.easeOut,
    });

    activeTimeline.to(maskRef.value, { opacity: 0, duration: 0.2 }, '-=0.15');
  };

  // ===================== VueUse 事件监听 =====================

  // 1. 点击弹窗外部自动关闭
  onClickOutside(dialogRef, () => {
    if (isModalOpen.value) closeModal();
  });

  // 2. 使用 useEventListener 替代手动 addEventListener/removeEventListener
  useEventListener(document, 'keydown', (e) => {
    if (isModalOpen.value && (e.key === 'Escape' || e.key === 'Esc')) {
      closeModal();
    }
  });

  // 3. 监听搜索结果重置滚动条
  watch(
    () => props.options,
    () => {
      nextTick(() => {
        if (scrollerRef.value) scrollerRef.value.scrollToPosition(0);
      });
    },
    { deep: false },
  );

  onUnmounted(() => {
    if (activeTimeline) activeTimeline.kill();
  });
</script>
<template>
  <div
    class="search-box"
    role="button"
    aria-label="Open Search Modal"
    @click="openModal"
  >
    <div class="search-box-input-left">
      <i-ep-search />
      <span class="search-box-input-placeholder">{{ placeholder }}</span>
    </div>
  </div>
  <Teleport :to="teleportTo">
    <div
      v-if="isModalOpen"
      ref="maskRef"
      class="search-modal-mask"
      :style="{ zIndex: zIndex }"
      @click.self="closeModal"
      tabindex="0"
    >
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        class="search-modal-dialog"
      >
        <div
          data-focus-lock-disabled="true"
          tabindex="-1"
          @click.stop
        >
          <div class="search-modal-dialog-content">
            <div class="search-modal-dialog-header">
              <div class="search-modal-left">
                <input
                  ref="inputRef"
                  type="search"
                  :placeholder="placeholder"
                  @input="handleInput"
                />
              </div>
              <div class="search-modal-right">
                <div class="search-modal-key-word">退出</div>
                <div class="search-modal-input-key">ESC</div>
              </div>
            </div>
            <div class="search-results-container">
              <RecycleScroller
                ref="scrollerRef"
                v-if="options.length > 0"
                class="scroller"
                :items="options"
                :item-size="54"
                key-field="id"
                :buffer="200"
                v-slot="{ item, index }"
              >
                <div
                  :key="item.id"
                  class="item-anim-wrapper"
                  :style="{ opacity: 0 }"
                  @vue:mounted="
                    (vnode: { el: HTMLElement }) => animateItemIn(vnode.el as HTMLElement, index)
                  "
                  @click.self="handleClick(item)"
                >
                  <div class="result-item">
                    <div class="item-icon"><i-ep-document /></div>
                    <div class="item-info">
                      <div class="item-title">{{ item.title }}</div>
                      <div
                        class="item-desc"
                        v-if="item.description"
                      >
                        {{ item.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </RecycleScroller>
              <div
                v-else
                class="no-results"
              >
                搜索到 0 个结果
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style lang="less" scoped>
  // ===================== 全局公共变量（统一管理，便于维护） =====================
  // 基础配色（冷灰色系，贴合扁平化风格）
  @color-placeholder: #86909c; // 占位符文字色
  @color-border-light: #e5e6eb; // 轻量边框色
  @color-border-mid: #c9cdd4; // 中等边框色
  @color-border-deep: #d1d5db; // 加深边框色
  @color-text-1: #1d2129; // 主文本色（补全未定义的CSS变量）
  @color-bg-base: rgb(242, 243, 245); // 搜索框基础背景
  @color-bg-hover: rgb(229, 230, 235); // 搜索框hover背景
  @color-bg-white: #ffffff; // 纯白背景

  // 尺寸变量（统一控制，便于响应式调整）
  @search-box-height: 32px;
  @search-box-width: 140px;
  @modal-dialog-width: 520px;
  @modal-header-height: 60px;
  @input-height: 32px;

  // 圆角变量（统一风格）
  @radius-sm: 3px;
  @radius-md: 4px;
  @radius-lg: 8px;

  // 阴影变量（统一光影风格）
  @shadow-flat: 0 1px 2px rgba(0, 0, 0, 0.05); // 扁平化轻微阴影
  @shadow-modal-3d:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(229, 230, 235, 0.3);
  @shadow-modal-3d-hover:
    0 12px 32px rgba(0, 0, 0, 0.09),
    0 6px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(229, 230, 235, 0.4);

  // ===================== 搜索框样式（扁平化核心） =====================
  .search-box {
    height: @search-box-height;
    width: @search-box-width;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: @color-bg-base;
    border-radius: @radius-md;
    padding: 0 8px;
    margin: 0 24px;
    transition: all 0.2s ease; // 补全ease过渡，交互更丝滑
    cursor: pointer;
    border: 1px solid transparent; // 预定义边框，hover时无位移

    &:hover {
      background: @color-bg-hover;
      border-color: @color-border-deep;
      box-shadow: @shadow-flat;
    }

    .search-box-input-left {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;

      .search-box-input-placeholder {
        color: @color-placeholder;
        margin: 0 6px;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }

  // ===================== 模态框遮罩层 =====================
  .search-modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(29, 33, 41, 0.6);
    z-index: 1001; // 补全z-index，避免被遮挡

    // ===================== 模态框主体（3D立体风格） =====================
    .search-modal-dialog {
      position: relative;
      margin: 0 auto;
      top: 100px;
      width: @modal-dialog-width;
      border: 1px solid rgba(229, 230, 235, 0.8);
      border-radius: @radius-lg;
      background: linear-gradient(145deg, @color-bg-white, #f8f9fa);
      box-shadow: @shadow-modal-3d;
      line-height: 1.5715;
      text-align: left;
      white-space: normal;
      box-sizing: border-box;
      transform: perspective(1000px) rotateX(0.5deg);
      transition: all 0.3s ease;

      // hover强化3D效果
      &:hover {
        box-shadow: @shadow-modal-3d-hover;
        transform: perspective(1000px) rotateX(1deg);
      }

      // ===================== 模态框内容区 =====================
      .search-modal-dialog-content {
        position: relative;
        font-size: 14px;
        color: @color-text-1;
        padding: 0;

        // 模态框头部
        .search-modal-dialog-header {
          height: @modal-header-height;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: @color-bg-white;
          border-bottom: 1px solid @color-border-light;
          border-radius: @radius-lg @radius-lg 0 0;

          .search-modal-left,
          .search-modal-right {
            display: flex;
            align-items: center;
          }

          // 搜索输入框
          .search-modal-left input {
            border: none;
            outline: none;
            height: @input-height;
            line-height: @input-height;
            font-size: 16px;
            background-color: transparent;
            color: @color-text-1; // 替换未定义的CSS变量，避免样式失效
            width: 100%; // 补全宽度，占满父容器
            padding: 0 4px; // 补全内边距，优化输入体验
            transition: all 0.2s;

            // 隐藏webkit清除按钮（兼容写法）
            &::-webkit-search-cancel-button {
              display: none;
              -webkit-appearance: none; // 补全-webkit前缀，提升兼容性
            }

            // 补充focus态样式，提升交互反馈
            &:focus {
              color: @color-text-1;
              caret-color: @color-placeholder; // 光标色统一
            }

            // 占位符样式统一
            &::placeholder {
              color: @color-placeholder;
              font-size: 14px; // 适配输入框字号
            }
          }
        }

        // 关键词文本
        .search-modal-key-word {
          font-size: 12px;
          color: @color-placeholder;
          margin: 0 4px 0 8px; // 简化margin写法
        }

        // 关键词标签
        .search-modal-input-key {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          height: 20px;
          background: @color-bg-white;
          border: 1px solid @color-border-mid;
          box-sizing: border-box;
          box-shadow: 0 1px 0 @color-border-mid;
          border-radius: @radius-sm;
          font-size: 12px;
          color: @color-placeholder;
        }
      }
    }
    .search-results-container {
      width: 100%;
      background: @color-bg-white;
      border-radius: 0 0 @radius-lg @radius-lg;
      overflow: hidden;

      .scroller {
        height: 400px; /* 固定高度启用虚拟列表 */
        padding: 8px 0;
        overflow-x: hidden;

        .result-item-wrapper {
          width: 100%;
          contain: content; // 告知浏览器该元素内容独立，优化渲染性能
          backface-visibility: hidden;
          perspective: 1000px;
        }
      }

      .no-results {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: @color-placeholder;
      }

      .result-item {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 54px; /* 必须与 item-size 一致 */
        contain: strict;
        cursor: pointer;
        background: @color-bg-white;

        &:hover {
          background: @color-bg-base;
        }

        .item-icon {
          margin-right: 12px;
          color: @color-placeholder;
        }
        .item-info {
          display: flex;
          flex-direction: column;
          .item-title {
            font-size: 14px;
            color: @color-text-1;
            font-weight: 500;
          }
          .item-desc {
            font-size: 12px;
            color: @color-placeholder;
          }
        }
      }
    }
  }
</style>
