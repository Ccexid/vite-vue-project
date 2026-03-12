import { createWebHashHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import { h, type Component } from 'vue';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import i18n from '@/locales';
import IEpHouse from '~icons/ep/house';

// 1. 注册 GSAP 插件
gsap.registerPlugin(ScrollToPlugin);

// 2. 扩展 RouteMeta 类型定义
declare module 'vue-router' {
  interface RouteMeta {
    title?: string; // 对应 i18n 的 key
    transition?: string;
    hidden?: boolean;
    icon?: Component; // 直接使用组件类型
    description?: string;
    keepAlive?: boolean;
  }
}

// 业务页面 (需要 Layout 嵌套)
export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard', // 子路由建议使用相对路径
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    // 使用 h() 函数渲染图标组件
    meta: { title: 'route.dashboard', icon: h(IEpHouse) },
  },
];

/**
 * 4. 最终路由树构造
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: dashboardRoutes,
  },
];

/**
 * 5. 创建路由实例
 */
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;

    // 如果是同页面锚点跳转，不触发动画
    if (to.hash) return { el: to.hash, behavior: 'smooth' };

    // 使用 GSAP 平滑滚动回顶部
    gsap.to(window, { duration: 0.3, scrollTo: { y: 0 }, ease: 'power2.out' });
    return { top: 0 };
  },
});

/**
 * 6. 辅助函数：获取翻译后的页面标题
 */
const getPageTitle = (titleKey?: string): string => {
  const defaultTitle = 'Admin';
  if (!titleKey) return defaultTitle;

  // i18n.global.t 在某些版本下需要正确处理 TFunction 类型
  // 这里假设你的 i18n 配置已经正确导出
  return i18n.global.te(titleKey) ? i18n.global.t(titleKey) : titleKey;
};

// 7. 路由后置守卫
router.afterEach((to) => {
  const title = getPageTitle(to.meta.title);
  document.title = title;
});

export default router;
