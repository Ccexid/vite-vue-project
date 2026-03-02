<script setup lang="ts">
  import gsap from 'gsap';

  const props = defineProps({
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['toggle']);

  const asideRef = ref<HTMLElement | null>(null);
  const logoTextRef = ref<HTMLElement | null>(null);
  const logoIconRef = ref<HTMLElement | null>(null);

  /**
   * 核心动画逻辑
   */
  const runAnimation = (collapsed: boolean, isInit = false) => {
    if (!asideRef.value) return;

    const duration = isInit ? 0 : 0.6;
    const ease = 'back.out(1.5)';

    // 1. 侧边栏宽度动画
    gsap.to(asideRef.value, {
      width: collapsed ? 64 : 240,
      duration,
      ease,
      overwrite: 'auto',
    });

    // 2. Logo 文字动画：位移 + 透明度 + 缩放
    if (logoTextRef.value) {
      gsap.to(logoTextRef.value, {
        x: collapsed ? -20 : 0,
        opacity: collapsed ? 0 : 1,
        scale: collapsed ? 0.8 : 1,
        duration: duration * 0.8,
        ease: collapsed ? 'power2.in' : 'back.out(1.2)',
      });
    }

    // 3. Logo 图标动画：稍微放大增强视觉重心
    if (logoIconRef.value) {
      gsap.to(logoIconRef.value, {
        scale: collapsed ? 1.2 : 1,
        duration,
        ease,
      });
    }
  };

  watch(
    () => props.isCollapsed,
    (val) => runAnimation(val),
  );

  onMounted(() => {
    // 初始化状态
    runAnimation(props.isCollapsed, true);
  });
</script>

<template>
  <aside
    ref="asideRef"
    class="app-layout-aside"
  >
    <div class="aside-header">
      <div class="logo-wrapper">
        <div
          ref="logoIconRef"
          class="logo-icon"
        >
          <img
            src="@/assets/vue.svg"
            alt="logo"
          />
        </div>
        <span
          ref="logoTextRef"
          class="logo-text"
        >
          Gemini Admin
        </span>
      </div>
    </div>

    <div class="aside-content">
      <slot>
        <div class="menu-list">
          <div
            v-for="i in 6"
            :key="i"
            class="menu-item"
          >
            <i-ep-house class="menu-icon"/>
            <span
              v-if="!isCollapsed"
              class="menu-label"
            >
              项目方案 {{ i }}
            </span>
          </div>
        </div>
      </slot>
    </div>

    <div class="aside-footer">
      <button
        class="toggle-btn"
        @click="emit('toggle')"
      >
        <div class="icon-box">
          <i-ep-fold v-if="!isCollapsed" />
          <i-ep-expand v-else />
        </div>
      </button>
    </div>
  </aside>
</template>

<style lang="less" scoped>
  .app-layout-aside {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--sb-bg-item);
    border-right: 1px solid var(--sb-border);
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.02);
    overflow: hidden;
    position: relative;
    z-index: 10;

    .aside-header {
      height: 72px; // 稍微加高显得更大气
      display: flex;
      align-items: center;
      padding: 0 16px;
      overflow: hidden;

      .logo-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 200px; // 保证文字不换行

        .logo-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(66, 184, 131, 0.2));

          img {
            width: 100%;
            height: 100%;
          }
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(120deg, var(--sb-primary), #42b883);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
          letter-spacing: -0.5px;
        }
      }
    }

    .aside-content {
      flex: 1;
      padding: 12px;

      .menu-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        color: var(--sb-text-main);
        transition: background 0.2s;
        gap: 12px;

        &:hover {
          background-color: var(--sb-primary-light);
          color: var(--sb-primary);
        }

        .menu-icon {
          flex-shrink: 0;
        }

        .menu-label {
          font-size: 14px;
          white-space: nowrap;
        }
      }
    }

    .aside-footer {
      padding: 16px;
      border-top: 1px solid var(--sb-border);

      .toggle-btn {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: var(--sb-bg-layout);
        border-radius: 8px;
        cursor: pointer;
        color: var(--sb-text-main);
        transition: all 0.2s;

        &:hover {
          background: var(--sb-primary);
          color: #fff;
        }

        .icon-box {
          font-size: 18px;
        }
      }
    }
  }

  // 兼容全局锁定逻辑
  :global(html[style*='--ripple-radius']) .app-layout-aside {
    transition: none !important;
  }
</style>
