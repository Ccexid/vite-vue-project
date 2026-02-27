<script lang="ts" setup>
  import { debounce } from 'lodash-es';
  import { gsap } from 'gsap';
  const isModalOpen = ref(false);
  const dialogRef = ref<HTMLDivElement | null>(null);
  const maskRef = ref<HTMLDivElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);
  let activeTimeline: gsap.core.Timeline | null = null;

  // 统一动画配置
  const animConfig = {
    duration: 0.3, // 缩短时间，让线性感更强
    ease: 'power2.out', // 弹出：线性减速
    easeOut: 'power2.in', // 关闭：线性加速
    startScale: 0.9, // 缩放范围从 0.9 到 1（比例小一点更显精致）
  };

  const props = defineProps({
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

  const placeholder = computed(() => props.placeholder);
  const teleportTo = computed(() => props.teleportTo);
  const zIndex = computed(() => props.zIndex);

  const emit = defineEmits<{
    (e: 'search', keyword: string): void;
  }>();

  /**
   * 防抖处理：明确定义参数类型为 string，返回值为 void
   * 延迟 300ms 触发，减少父组件过滤逻辑的计算压力
   */
  const debouncedSearch = debounce((value: string): void => {
    console.log('search input...', value);
    emit('search', value);
  }, 300);

  /**
   * 处理输入事件
   */
  const handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    debouncedSearch(target.value);
  };

  /**
   * 打开弹窗逻辑
   * 流程：开启状态 -> 等待DOM -> 清理旧动画 -> 执行新动画 -> 自动聚焦
   */
  const openModal = async () => {
    if (isModalOpen.value) return;
    isModalOpen.value = true;
    await nextTick();

    if (activeTimeline) activeTimeline.kill();
    activeTimeline = gsap.timeline();

    activeTimeline.fromTo(maskRef.value, { opacity: 0 }, { opacity: 1, duration: 0.2 }).fromTo(
      dialogRef.value,
      {
        opacity: 0,
        scale: animConfig.startScale, // 从 0.9 开始
        y: 10, // 稍微有点向上的位移即可，不要过大
        transform: 'perspective(1000px) rotateX(0deg)', // 去掉 3D 旋转保持平面化线性感
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: animConfig.duration,
        ease: animConfig.ease, // 使用线性减速
        onComplete: () => {
          inputRef.value?.focus();
        },
      },
      '-=0.1',
    );
  };

  /**
   * 关闭弹窗逻辑
   * 流程：等待动画 -> 清理动画 -> 关闭状态
   */
  const closeModal = () => {
    if (activeTimeline) activeTimeline.kill();
    activeTimeline = gsap.timeline({
      onComplete: () => {
        isModalOpen.value = false;
      },
    });

    activeTimeline.to(dialogRef.value, {
      opacity: 0,
      scale: animConfig.startScale, // 缩回到 0.9
      y: 10, // 向下位移
      duration: 0.25,
      ease: animConfig.easeOut, // 线性加速消失
    });

    activeTimeline.to(
      maskRef.value,
      {
        opacity: 0,
        duration: 0.2,
      },
      '-=0.15',
    );
  };

  const handleKeyDownWithESC = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Esc') closeModal();
  };

  const handleInputFocus = () => {
    inputRef.value?.select(); // 聚焦时全选文字，方便快速重写
  };
  /**
   *  监听弹窗状态变化，控制 body 滚动
   */
  watch(isModalOpen, (val) => {
    if (val) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDownWithESC);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDownWithESC);
    }
  });
  /**
   * 组件卸载时，移除事件监听和动画
   */
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDownWithESC);
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
                  @focus="handleInputFocus"
                  @input="handleInput"
                />
              </div>
              <div class="search-modal-right">
                <div class="search-modal-key-word">退出</div>
                <div class="search-modal-input-key">ESC</div>
              </div>
            </div>
            <div class="search-results">搜索到 0 个结果</div>
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
    .search-results {
      width: 100%;
      padding: 20px;
      color: @color-placeholder;
      text-align: center;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
