import { reactive, watch, nextTick } from 'vue';
import { useDark } from '@vueuse/core';
import type { GlobalThemeOverrides } from 'naive-ui';
import { hslToRgb } from '@/utils/theme';

export function useThemeAdapter() {
  const isDark = useDark();

  // 1. 初始 Token 对象
  const themeTokens = reactive<GlobalThemeOverrides>({
    common: {
      primaryColor: '',
      primaryColorHover: '',
      primaryColorPressed: '',
      primaryColorSuppl: '',
      bodyColor: '',
      cardColor: '',
      modalColor: '',
      popoverColor: '',
      textColor1: '',
      textColor2: '',
      borderColor: '',
      dividerColor: '',
      borderRadius: '',
    },
  });

  /**
   * 2. 更新 Token 的核心逻辑
   */
  const updateThemeTokens = () => {
    const rootStyles = getComputedStyle(document.documentElement);

    const getC = (varName: string) => {
      const val = rootStyles.getPropertyValue(varName).trim();
      return val ? hslToRgb(val) : '';
    };

    // 重新赋值整个 common 对象，触发 Naive UI 响应式更新
    themeTokens.common = {
      ...themeTokens.common,
      primaryColor: getC('--primary'),
      primaryColorHover: getC('--primary-hover'),
      primaryColorPressed: getC('--primary-active'),
      primaryColorSuppl: getC('--primary-suppl'),
      bodyColor: getC('--background'),
      cardColor: getC('--card'),
      modalColor: getC('--card'),
      popoverColor: getC('--popover'),
      textColor1: getC('--foreground'),
      textColor2: getC('--muted-foreground'),
      borderColor: getC('--border'),
      dividerColor: getC('--divider'),
      borderRadius: rootStyles.getPropertyValue('--radius').trim() || '6px',
      fontFamily: rootStyles.getPropertyValue('--font-family').trim(),
    };
  };

  /**
   * 3. 改进的监听器
   * 解决闪烁的关键：等待浏览器完成重绘
   */
  watch(
    isDark,
    async () => {
      // 第一步：等待 Vue DOM 变更（html class="dark" 变更）
      await nextTick();

      // 第二步：等待浏览器样式计算完成
      // 使用双重 requestAnimationFrame 确保在下一帧渲染前已经拿到了最新的样式值
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateThemeTokens();
        });
      });
    },
    { immediate: true },
  );

  return {
    themeTokens,
    updateThemeTokens,
  };
}
