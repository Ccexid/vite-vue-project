<script setup lang="ts">
  import { useStorage, onClickOutside } from '@vueuse/core';
  import { useI18n } from 'vue-i18n';
  import { gsap } from 'gsap';

  // 定义 Props 支持自定义配置
  interface LangOption {
    label: string;
    value: string;
    icon?: string;
  }

  const props = defineProps({
    options: {
      type: Array as () => LangOption[],
      default: () => [
        { label: '简体中文', value: 'zh-CN' },
        { label: 'English', value: 'en' },
      ],
    },
  });

  const { locale } = useI18n();
  const savedLocale = useStorage('selected-lang', 'zh-CN');

  const isLangMenuOpen = ref(false);
  const langMenuRef = ref(null);
  const dropdownRef = ref(null);
  const arrowRef = ref(null);

  // 使用 GSAP 执行动画
  const toggleMenu = (isOpen: boolean) => {
    isLangMenuOpen.value = isOpen;

    if (isOpen) {
      // 下拉菜单展开动画
      gsap.fromTo(
        dropdownRef.value,
        { opacity: 0, y: 10, display: 'none' },
        { opacity: 1, y: 0, display: 'block', duration: 0.3, ease: 'back.out(1.7)' },
      );
      // 箭头旋转
      gsap.to(arrowRef.value, { rotation: 180, duration: 0.3 });
    } else {
      // 下拉菜单收起动画
      gsap.to(dropdownRef.value, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: () => {
          if (dropdownRef.value) (dropdownRef.value as HTMLElement).style.display = 'none';
        },
      });
      // 箭头复位
      gsap.to(arrowRef.value, { rotation: 0, duration: 0.3 });
    }
  };

  const handleSetLanguage = (lang: string) => {
    locale.value = lang;
    savedLocale.value = lang;
    toggleMenu(false);
  };

  onClickOutside(langMenuRef, () => {
    if (isLangMenuOpen.value) toggleMenu(false);
  });
</script>

<template>
  <div
    class="lang-selector"
    ref="langMenuRef"
  >
    <div
      class="lang-trigger"
      @click="toggleMenu(!isLangMenuOpen)"
      :class="{ 'is-active': isLangMenuOpen }"
    >
      <i-ic-baseline-language class="lang-icon" />
      <span class="current-lang">{{ locale === 'zh-CN' ? '中文' : 'EN' }}</span>
      <div
        ref="arrowRef"
        class="arrow-container"
      >
        <i-ep-arrow-down class="arrow-icon" />
      </div>
    </div>

    <div
      ref="dropdownRef"
      class="lang-dropdown"
      style="display: none"
    >
      <div
        v-for="item in props.options"
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
  </div>
</template>

<style lang="less" scoped>
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
      .arrow-container {
        display: flex;
        align-items: center;
        font-size: 12px;
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
      z-index: 1000;

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
</style>
