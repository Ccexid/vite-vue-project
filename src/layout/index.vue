<script setup lang="ts">
  import { useStorage } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import AppAside from '@/layout/components/app-aside/index.vue';
  import { onClickOutside } from '@vueuse/core';

  const route = useRoute();
  const { locale, t } = useI18n();
  const savedLocale = useStorage('selected-lang', 'zh-CN');

  // 控制下拉菜单显示状态
  const isLangMenuOpen = ref(false);
  const langMenuRef = ref(null);

  const isCollapsed = useStorage('sidebar-collapsed', false);
  const toggleAside = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  // 语言选项配置
  const langOptions = [
    { label: '简体中文', value: 'zh-CN', icon: '中' },
    { label: 'English', value: 'en', icon: 'En' },
  ];

  // 切换语言逻辑
  const handleSetLanguage = (lang: string) => {
    locale.value = lang;
    savedLocale.value = lang;
    isLangMenuOpen.value = false;
  };

  const updateTitle = () => {
    const titleKey = route.meta?.title as string; //
    if (titleKey) {
      document.title = t(titleKey); //
    }
  };

  watch(
    locale,
    () => {
      updateTitle(); //
    },
    { immediate: true },
  );

  watch(
    () => route.path,
    () => {
      updateTitle(); //
    },
  );

  // 点击外部关闭下拉菜单
  onClickOutside(langMenuRef, () => {
    isLangMenuOpen.value = false;
  });
</script>

<template>
  <section class="app-layout">
    <AppAside
      :is-collapsed="isCollapsed"
      @toggle="toggleAside"
    />

    <section class="app-layout-container">
      <header class="app-layout-header">
        <div class="header-left">
          <slot name="header-left"></slot>
        </div>

        <div class="header-right">
          <slot name="header-right">
            <div class="header-actions">
              <div
                class="lang-selector"
                ref="langMenuRef"
              >
                <div
                  class="lang-trigger"
                  @click="isLangMenuOpen = !isLangMenuOpen"
                  :class="{ 'is-active': isLangMenuOpen }"
                >
                  <i-ep-guide class="lang-icon" />
                  <span class="current-lang">{{ locale === 'zh-CN' ? '中文' : 'EN' }}</span>
                  <i-ep-arrow-down
                    class="arrow-icon"
                    :class="{ rotate: isLangMenuOpen }"
                  />
                </div>

                <transition name="slide-up">
                  <div
                    v-if="isLangMenuOpen"
                    class="lang-dropdown"
                  >
                    <div
                      v-for="item in langOptions"
                      :key="item.value"
                      class="lang-item"
                      :class="{ 'is-selected': locale === item.value }"
                      @click="handleSetLanguage(item.value)"
                    >
                      <span class="lang-label">{{ item.label }}</span>
                      <i-ep-check
                        v-if="locale === item.value"
                        class="check-icon"
                      />
                    </div>
                  </div>
                </transition>
              </div>

              <DarkCheckBox />
            </div>
          </slot>
        </div>
      </header>

      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition
            name="fade-transform"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>

        <footer class="app-footer">
          <p>© 2024 Your Company. All rights reserved.</p>
        </footer>
      </main>
    </section>
  </section>
</template>

<style lang="less" scoped>
  .app-layout {
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: var(--sb-bg-layout);

    &-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &-header {
      height: 60px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--sb-bg-item);
      border-bottom: 1px solid var(--sb-border);
      position: relative;
      z-index: 100;

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    // 语言选择器样式
    .lang-selector {
      position: relative;

      .lang-trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        color: var(--sb-text-main);

        &:hover,
        &.is-active {
          background-color: var(--sb-bg-layout);
          border-color: var(--sb-border);
        }

        .lang-icon {
          font-size: 16px;
        }
        .current-lang {
          font-size: 13px;
          font-weight: 500;
        }
        .arrow-icon {
          font-size: 12px;
          transition: transform 0.3s;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }

      .lang-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 120px;
        background-color: var(--sb-bg-item);
        border: 1px solid var(--sb-border);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 4px;
        overflow: hidden;

        .lang-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          color: var(--sb-text-main);
          transition: background 0.2s;

          &:hover {
            background-color: var(--sb-bg-layout);
          }

          &.is-selected {
            color: var(--sb-primary);
            font-weight: bold;
            background-color: var(--sb-primary-light);
          }

          .check-icon {
            font-size: 12px;
          }
        }
      }
    }

    .app-main {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .app-footer {
      padding: 15px 0;
      text-align: center;
      color: var(--sb-text-muted);
      font-size: 12px;
    }
  }

  // 下拉动画
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.2s ease-out;
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  // 路由过渡动画
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: all 0.3s ease;
  }
  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-15px);
  }
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(15px);
  }
</style>
