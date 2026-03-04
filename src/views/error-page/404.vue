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
      <h1 class="error-code">404</h1>

      <div class="error-info">
        <h2 class="error-msg">{{ $t('common.pageNotFound') || '抱歉，您访问的页面不存在' }}</h2>
        <p class="error-desc">
          {{ $t('common.pageNotFoundDesc') || '当前页面可能已被移除或地址输入错误' }}
        </p>
      </div>

      <div class="back-btn-wrapper">
        <NButton
          type="primary"
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
    background-color: var(--sb-bg-layout); // 使用你项目中的背景变量
    color: var(--sb-text-main);
    overflow: hidden;

    .content-box {
      text-align: center;
      padding: 40px;

      .error-code {
        font-size: 120px;
        font-weight: 800;
        margin: 0;
        line-height: 1;
        // 使用品牌主色渐变
        background: linear-gradient(135deg, var(--sb-primary), #a0cfff);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -5px;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
      }

      .error-info {
        margin-top: 20px;
        margin-bottom: 40px;

        .error-msg {
          font-size: 24px;
          color: var(--sb-text-main);
          margin-bottom: 12px;
        }

        .error-desc {
          font-size: 14px;
          color: var(--sb-text-muted); // 使用你项目中的置灰文字变量
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
          box-shadow: 0 4px 14px 0 rgba(var(--sb-primary-rgb), 0.39);

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
