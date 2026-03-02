<script lang="ts" setup>
  import { debounce } from 'lodash-es';
  import { gsap } from 'gsap';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import { onClickOutside, useEventListener, useFocus, useScrollLock } from '@vueuse/core';
  import type { SearchItem } from '@/types/search-box';


  // ===================== 状态与 Refs =====================
  const isModalOpen = ref(false);
  const searchQuery = ref('');
  const activeIndex = ref(0);
  const isKeyboardMode = ref(false); // 【新增】标记是否处于键盘操作模式

  const dialogRef = ref<HTMLDivElement | null>(null);
  const maskRef = ref<HTMLDivElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);
  const scrollerRef = ref();
  let activeTimeline: gsap.core.Timeline | null = null;

  const { focused } = useFocus(inputRef);
  const isLocked = useScrollLock(document.body);

  const props = defineProps({
    options: {
      type: Array as PropType<SearchItem[]>,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '搜索文档或资源...',
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

  // ===================== 逻辑处理 =====================

  // 【新增】处理鼠标移入：键盘模式下不更新索引
  const handleMouseEnter = (index: number) => {
    if (isKeyboardMode.value) return;
    activeIndex.value = index;
  };

  // 【新增】处理鼠标移动：一旦鼠标动了，就恢复鼠标控制权限
  const handleMouseMove = () => {
    isKeyboardMode.value = false;
  };

  const getHighlightedText = (text: string) => {
    if (!searchQuery.value.trim()) return text;
    const regex = new RegExp(`(${searchQuery.value})`, 'gi');
    return text.replace(regex, '<mark class="algolia-highlight">$1</mark>');
  };

  const animateItemIn = (el: HTMLElement | null, index: number) => {
    if (!el) return;
    requestAnimationFrame(() => {
      gsap.killTweensOf(el);
      if (index > 10) {
        gsap.set(el, { opacity: 1, x: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, x: -10, scale: 0.98 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.25,
          delay: index * 0.02,
          ease: 'power2.out',
          force3D: true,
          clearProps: 'all',
        },
      );
    });
  };

  const debouncedSearch = debounce((value: string): void => {
    emit('search', value);
    activeIndex.value = 0;
    isKeyboardMode.value = false; // 搜索后重置模式
  }, 200);

  const selectItem = (item: SearchItem) => {
    emit('click-item', item);
    closeModal();
  };

  const handleInput = (e: Event): void => {
    const target = e.target as HTMLInputElement;
    searchQuery.value = target.value;
    debouncedSearch(target.value);
  };

  const openModal = async () => {
    if (isModalOpen.value) return;
    isModalOpen.value = true;
    activeIndex.value = 0;
    isKeyboardMode.value = false; // 重置模式
    isLocked.value = true;
    await nextTick();

    activeTimeline = gsap.timeline();
    activeTimeline
      .fromTo(maskRef.value, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      .fromTo(
        dialogRef.value,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.2)' },
        '-=0.1',
      );
    focused.value = true;

    nextTick(() => {
      scrollerRef.value?.updateVisibleItems(true);
    });
  };

  const closeModal = () => {
    isLocked.value = false;
    gsap.to(dialogRef.value, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.2,
      onComplete: () => {
        isModalOpen.value = false;
        searchQuery.value = '';
      },
    });
    gsap.to(maskRef.value, { opacity: 0, duration: 0.2 });
    emit('search', '');
  };

  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  useEventListener(document, 'keydown', (e) => {
    if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal();
    }
    if (e.key === 'Escape' && isModalOpen.value) closeModal();

    const len = props.options.length;
    if (len === 0 || !isModalOpen.value) return;

    // 【增强】上下键逻辑并激活键盘模式
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      isKeyboardMode.value = true; // 锁定鼠标
      const index = activeIndex.value + 1;
      if (len <= index) return;
      activeIndex.value = index;
      scrollerRef.value?.scrollToItem(index);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      isKeyboardMode.value = true; // 锁定鼠标
      const index = activeIndex.value - 1;
      if (0 > index) return;
      activeIndex.value = index;
      scrollerRef.value?.scrollToItem(index);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = props.options[activeIndex.value];
      if (selected) {
        selectItem(selected);
      }
    }
  });

  onClickOutside(dialogRef, closeModal);

  watch(
    () => props.options,
    () => {
      nextTick(() => scrollerRef.value?.scrollToPosition(0));
    },
  );
</script>

<template>
  <div
    class="algolia-trigger"
    @click="openModal"
  >
    <div class="left">
      <i-ep-search class="search-icon" />
      <span>{{ placeholder }}</span>
    </div>
    <div class="shortcut-hint">
      <span class="key">{{ isMac ? '⌘' : 'Ctrl' }}</span>
      <span class="key">K</span>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="isModalOpen"
      ref="maskRef"
      class="algolia-mask"
    >
      <div
        ref="dialogRef"
        class="algolia-dialog"
        @mousemove="handleMouseMove"
      >
        <header class="algolia-header">
          <i-ep-search class="input-icon" />
          <input
            ref="inputRef"
            :value="searchQuery"
            type="text"
            :placeholder="placeholder"
            @input="handleInput"
          />
          <button
            v-if="searchQuery"
            class="clear-btn"
            @click="
              searchQuery = '';
              emit('search', '');
            "
          >
            <i-ep-circle-close />
          </button>
        </header>

        <div class="algolia-body">
          <RecycleScroller
            ref="scrollerRef"
            v-if="options.length > 0"
            :items="options"
            :item-size="64"
            :min-item-size="64"
            key-field="id"
            class="scroller"
            v-slot="{ item, index }"
          >
            <div
              class="algolia-item-wrapper"
              @vue:mounted="(vnode: any) => animateItemIn(vnode.el, index)"
              @click="selectItem(item)"
              @mouseenter="handleMouseEnter(index)"
            >
              <div
                class="algolia-item"
                :class="{ 'is-active': activeIndex === index }"
              >
                <div class="item-icon-box"><i-ep-document /></div>
                <div class="item-content">
                  <div
                    class="title"
                    v-html="getHighlightedText(item.title)"
                  ></div>
                  <div
                    class="desc"
                    v-if="item.description"
                  >
                    {{ item.description }}
                  </div>
                </div>
                <div class="enter-icon">
                  <i-ep-arrow-right />
                </div>
              </div>
            </div>
          </RecycleScroller>

          <div
            v-else
            class="empty-state"
          >
            <i-ep-folder style="font-size: 40px; opacity: 0.3" />
            <p>没有找到与 "{{ searchQuery }}" 相关的结果</p>
          </div>
        </div>

        <footer class="algolia-footer">
          <div class="footer-item">
            <span class="key-tag">Enter</span>
            确认
          </div>
          <div class="footer-item">
            <span class="key-tag">↑↓</span>
            选择
          </div>
          <div class="footer-item">
            <span class="key-tag">Esc</span>
            关闭
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
  /* 样式部分完全保持不变，引用自您提供的源代码 */
  .algolia-trigger {
    width: 240px;
    height: 36px;
    background: var(--sb-border);
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    cursor: pointer;
    border: 1px solid transparent;
    transition:
      background-color 0.2s,
      border-color 0.2s;
    &:hover {
      background: var(--sb-bg-input);
      border-color: var(--sb-primary);
      .search-icon {
        color: var(--sb-primary);
      }
    }
    .left {
      display: flex;
      align-items: center;
      color: var(--sb-text-muted);
      font-size: 14px;
      .search-icon {
        margin-right: 8px;
        font-size: 16px;
      }
    }
    .shortcut-hint {
      display: flex;
      gap: 4px;
      .key {
        background: var(--sb-bg-input);
        border: 1px solid var(--sb-border);
        border-radius: 4px;
        padding: 0 4px;
        font-size: 11px;
        color: var(--sb-text-muted);
        min-width: 18px;
        text-align: center;
      }
    }
  }

  .algolia-mask {
    position: fixed;
    inset: 0;
    background: var(--sb-bg-mask);
    display: flex;
    justify-content: center;
    padding-top: 80px;
    z-index: 2000;
    backdrop-filter: blur(4px);
  }

  .algolia-dialog {
    width: 600px;
    max-height: 80vh;
    background: var(--sb-bg-dialog);
    border-radius: 8px;
    box-shadow: var(--sb-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--sb-border);
  }

  .algolia-header {
    height: 64px;
    background: var(--sb-bg-input);
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 2px solid var(--sb-primary);
    .input-icon {
      font-size: 22px;
      color: var(--sb-primary);
      margin-right: 12px;
    }
    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 18px;
      color: var(--sb-text-main);
      background: transparent;
      &::placeholder {
        color: var(--sb-text-muted);
      }
    }
    .clear-btn {
      border: none;
      background: none;
      cursor: pointer;
      color: var(--sb-text-muted);
      &:hover {
        color: var(--sb-primary);
      }
    }
  }

  .algolia-body {
    flex: 1;
    overflow: hidden;
    background: var(--sb-bg-dialog);
    .scroller {
      height: 500px;
      padding: 0 12px;
      overflow-y: auto !important;
      scrollbar-width: thin;
      scrollbar-color: var(--sb-scrollbar-thumb) var(--sb-scrollbar-track);
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: var(--sb-scrollbar-track);
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--sb-scrollbar-thumb);
        border-radius: 10px;
        border: 1px solid var(--sb-scrollbar-track);
        &:hover {
          filter: brightness(1.1);
        }
      }
    }
  }

  .algolia-item-wrapper {
    height: 64px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .algolia-item {
    width: 100%;
    background: var(--sb-bg-item);
    border-radius: 6px;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: var(--sb-item-shadow);
    overflow: hidden;
    transition:
      background-color 0.15s ease,
      box-shadow 0.15s ease;
    &.is-active {
      background: var(--sb-primary);
      box-shadow: 0 4px 12px rgba(84, 104, 255, 0.4);
      .title,
      .desc,
      .item-icon-box {
        color: var(--sb-text-white) !important;
      }
      .enter-icon {
        opacity: 1;
        color: var(--sb-text-white) !important;
        transform: translateX(0);
      }
    }
    .item-icon-box {
      color: var(--sb-text-muted);
      margin-right: 16px;
      font-size: 20px;
    }
    .item-content {
      flex: 1;
      .title {
        font-size: 14px;
        font-weight: 500;
        color: var(--sb-text-main);
      }
      .desc {
        font-size: 12px;
        color: var(--sb-text-muted);
        margin-top: 2px;
      }
    }
    .enter-icon {
      opacity: 0;
      font-size: 14px;
      color: var(--sb-text-white);
      transform: translateX(-5px);
      transition: all 0.2s ease;
    }
  }

  .algolia-footer {
    height: 44px;
    background: var(--sb-bg-footer);
    border-top: 1px solid var(--sb-border);
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 20px;
    font-size: 12px;
    color: var(--sb-text-muted);
    .key-tag {
      background: var(--sb-bg-dialog);
      border: 1px solid var(--sb-border);
      border-radius: 4px;
      padding: 2px 6px;
      font-weight: bold;
      color: var(--sb-text-main);
      margin-right: 4px;
    }
  }

  .empty-state {
    padding: 60px 0;
    text-align: center;
    color: var(--sb-text-muted);
  }

  .algolia-highlight {
    background: transparent;
    color: var(--sb-primary);
    text-decoration: underline;
    font-weight: bold;
  }
  .is-active .algolia-highlight {
    color: var(--sb-text-white) !important;
  }

  :global(html[style*='--ripple-radius']) & {
    *,
    .algolia-trigger,
    .algolia-item,
    .enter-icon {
      transition: none !important;
    }
  }
</style>
