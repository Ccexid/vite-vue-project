<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { gsap } from 'gsap';

  const router = useRouter();

  const goBack = () => {
    // 使用 replace 防止用户点击浏览器返回键回到 404
    router.replace('/');
  };

  // 页面加载时的动效
  onMounted(() => {
    const tl = gsap.timeline();
    tl.from('.error-code', {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
      .from(
        '.error-msg',
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
        },
        '-=0.3',
      )
      .from(
        '.back-btn-wrapper',
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.2',
      );
  });
</script>

<template>
  <div
    class="error-page-container"
    ref="containerRef"
  >
    <div class="content-box">
      <n-gradient-text
        type="danger"
        :size="120"
        class="error-code"
      >
        404
      </n-gradient-text>

      <div class="error-info">
        <h2 class="error-msg">{{ $t('common.pageNotFound') || '抱歉，您访问的页面不存在' }}</h2>
        <p class="error-desc">
          {{ $t('common.pageNotFoundDesc') || '当前页面可能已被移除或地址输入错误' }}
        </p>
      </div>

      <div class="back-btn-wrapper">
        <NButton
          type="error"
          @click="goBack"
          class="custom-back-btn"
        >
          <div class="btn-content">
            <IEpBack class="icon" />
            <span>{{ $t('common.backHome') || '返回首页' }}</span>
          </div>
        </NButton>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .error-page-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: var(--bg-body); // 使用你项目中的背景变量
    color: var(--text-primary);
    overflow: hidden;

    .content-box {
      text-align: center;
      padding: 40px;

      .error-info {
        margin-top: 20px;
        margin-bottom: 40px;

        .error-msg {
          font-size: 24px;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .error-desc {
          font-size: 14px;
          color: var(--text-secondary); // 使用你项目中的置灰文字变量
        }
      }

      .back-btn-wrapper {
        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 10px;

          .icon {
            font-size: 16px;
            transition: transform 0.3s ease;
          }
        }

        .custom-back-btn {
          height: 44px;
          border-radius: 22px;
          padding: 0 30px;
          font-weight: 600;
          box-shadow: 0 4px 14px 0 rgba(var(--color-primary-rgb), 0.39);

          &:hover {
            .icon {
              transform: translateX(-4px); // 悬浮时箭头向左微动
            }
          }
        }
      }
    }
  }

  // 适配移动端
  @media (max-width: 768px) {
    .error-code {
      font-size: 80px !important;
    }
    .error-msg {
      font-size: 20px !important;
    }
  }
</style>
