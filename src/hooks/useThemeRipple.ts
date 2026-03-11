import { type Ref, type ComponentPublicInstance } from 'vue'; // 引入 Ref 类型
import { useDark } from '@vueuse/core';
import gsap from 'gsap';

// 修正参数类型为 Ref<...>
export function useThemeRipple(layoutRef: Ref<ComponentPublicInstance | null>) {
  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
  });

  const toggleTheme = (event: MouseEvent, darkBgColor = '#101014') => {
    // 这里的逻辑保持不变
    const instance = layoutRef.value;
    const el = instance?.$el as HTMLElement;
    if (!el || typeof el.getBoundingClientRect !== 'function') return;

    const { clientX, clientY } = event;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const maxRadius = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y)
    );

    const ripple = document.createElement('div');
    ripple.className = 'theme-mask-layer';
    
    Object.assign(ripple.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '5',
      pointerEvents: 'none',
      willChange: 'clip-path',
      backgroundColor: darkBgColor
    });
    
    el.appendChild(ripple);

    if (!isDark.value) {
      /* --- 场景 A: 白转黑 (涟漪变大) --- */
      gsap.set(ripple, { clipPath: `circle(0px at ${x}px ${y}px)` });
      gsap.to(ripple, {
        clipPath: `circle(${maxRadius}px at ${x}px ${y}px)`,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          isDark.value = true;
          ripple.remove();
        }
      });
    } else {
      /* --- 场景 B: 黑转白 (涟漪变小) --- */
      isDark.value = false;
      gsap.set(ripple, { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` });
      gsap.to(ripple, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          ripple.remove();
        }
      });
    }
  };

  return {
    isDark,
    toggleTheme
  };
}