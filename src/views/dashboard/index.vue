<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
  import { getHotboard, type HotboardResponse } from '@/api/uapis';
  import gsap from 'gsap'; // 引入 GSAP
  import { useLoadingBar } from 'naive-ui';

  const hotboardResponse = ref<HotboardResponse>({} as HotboardResponse);
  const cardRefs = ref<HTMLElement[]>([]); // 收集卡片 DOM 节点

  const loadingBar = useLoadingBar();

  const fetchHotboard = async () => {
    loadingBar.start();
    try {
      loadingBar.finish();
      const res = await getHotboard({ type: 'bilibili' });
      hotboardResponse.value = res || ({} as HotboardResponse);

      // 数据渲染后执行 GSAP 入场动画
      nextTick(() => {
        initStaggerAnimation();
      });
    } catch (error: any) {
      console.error('[Error]:', error.message || 'Unknown Error');
      loadingBar.error();
    }
  };

  /**
   * GSAP 入场交错动画
   */
  const initStaggerAnimation = () => {
    if (cardRefs.value.length === 0) return;

    // 先将所有卡片初始状态设为不可见
    gsap.set(cardRefs.value, { opacity: 0, y: 30 });

    // 执行交错动画
    gsap.to(cardRefs.value, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: {
        amount: 0.5, // 整个序列在 0.5 秒内完成交错
        grid: 'auto', // 自动识别瀑布流布局网格
        from: 'start',
      },
    });
  };

  /**
   * GSAP 悬停动画：比 CSS 更平滑的物理质感
   */
  const onMouseEnter = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    gsap.to(el, {
      y: -8,
      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
      duration: 0.3,
      ease: 'power2.out',
    });
    // 图片轻微缩放
    const img = el.querySelector('img');
    if (img) gsap.to(img, { scale: 1.08, duration: 0.5, ease: 'power2.out' });
  };

  const onMouseLeave = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    gsap.to(el, {
      y: 0,
      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
      duration: 0.3,
      ease: 'power2.inOut',
    });
    const img = el.querySelector('img');
    if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.inOut' });
  };

  const handleOpenLink = (url: string) => {
    if (url) window.open(url, '_blank');
  };

  onMounted(() => {
    fetchHotboard();
  });
</script>

<template>
  <div class="dashboard-wrapper p-20px bg-[var(--bg-body)] min-h-100vh">
    <div class="waterfall-container">
      <div
        v-for="(item, index) in hotboardResponse.list"
        :key="item.index"
        ref="cardRefs"
        class="waterfall-item mb-16px"
      >
        <NCard
          hoverable
          class="custom-card cursor-pointer"
          @click="handleOpenLink(item.url)"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <template #cover>
            <div class="relative overflow-hidden group">
              <img
                v-if="item.extra?.pic"
                :src="item.extra?.pic"
                referrerpolicy="no-referrer"
                class="w-full h-auto block"
                alt="cover"
              />
              <div
                class="absolute inset-0 bg-[var(--sb-bg-button)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                <div class="i-carbon-launch text-[var(--text-primary)] text-24px"></div>
              </div>
            </div>
          </template>

          <div class="p-2px">
            <h3
              class="m-0 text-14px font-600 line-clamp-2 color-[var(--text-primary)] transition-colors"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.extra?.desc"
              class="mt-8px mb-12px text-12px color-[var(--text-secondary)] line-clamp-3"
            >
              {{ item.extra?.desc }}
            </p>
            <div
              class="mt-12px pt-10px border-t border-t-solid border-[var(--border-color)] flex justify-between items-center"
            >
              <div class="flex items-center gap-4px">
                <div class="i-carbon-fire text-orange-500 text-14px"></div>
                <span class="text-12px font-500 color-orange-600">{{ item.hot_value }}</span>
              </div>
              <NTag
                :bordered="false"
                size="tiny"
                round
                :type="index < 3 ? 'error' : 'default'"
              >
                TOP {{ item.index }}
              </NTag>
            </div>
          </div>
        </NCard>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .waterfall-container {
    column-count: 3;
    column-gap: 20px;
    @media (max-width: 1200px) {
      column-count: 2;
    }
    @media (max-width: 768px) {
      column-count: 1;
    }

    .waterfall-item {
      break-inside: avoid;
      display: inline-block;
      width: 100%;
      will-change: transform, opacity; // 优化性能
    }
  }

  .custom-card {
    border: none !important;
    background: var(--bg-card);
    // 移除 CSS 原生的 transition，由 GSAP 托管
    :deep(.n-card-cover) {
      border-bottom: 1px solid var(--border-color);
    }
    :deep(.n-card__content) {
      padding: 12px !important;
    }
  }
</style>
