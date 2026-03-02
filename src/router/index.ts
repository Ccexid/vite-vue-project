import { createWebHashHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// 1. 注册gsap滚动插件
gsap.registerPlugin(ScrollToPlugin);

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    transition?: string;
    hidden?: boolean;
  }
}

// 2. 业务模块路由（需要 Layout 布局的）
const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '', // 对应父级的 /
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '仪表盘' }
  }
];

// 3. 错误页模块路由（独立的，不依赖 Layout）
const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error-page/404.vue'),
    meta: { title: '页面迷路啦~' }
  }
];

// 4. 最终路由配置
const routes: RouteRecordRaw[] = [
  // --- 分组 A: 需要 Layout 的页面 ---
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    children: [
      ...dashboardRoutes
      // 其他业务模块也放在这里...
    ]
  },

  // --- 分组 B: 独立页面 (404, 登录页等) ---
  ...errorRoutes,

  // --- 分组 C: 兜底重定向 ---
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

// 5. 创建路由实例
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
    return { top: 0 };
  }
});

export default router;