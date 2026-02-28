import { createWebHashHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

// 1. 注册gsap滚动插件（保留原有逻辑）
gsap.registerPlugin(ScrollToPlugin);

/**
 * 扩展Vue Router的Meta类型（抽离到顶部，结构更清晰）
 * 支持：页面标题、过渡动画、是否隐藏（如侧边栏菜单）
 */
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;       // 页面标题
    transition?: string;  // 路由过渡动画
    hidden?: boolean;     // 是否在菜单中隐藏
  }
}

// 2. 拆分路由模块（按业务维度拆分，便于维护）
// 仪表盘模块路由
const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '仪表盘' }
  }
];

// 错误页模块路由
const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error-page/404.vue'),
    meta: { title: '页面迷路啦~' }
  }
];

// 3. 用reduce合并所有业务路由模块（核心：批量归并，新增模块只需加数组）
const businessRoutes = [dashboardRoutes, errorRoutes].reduce(
  (totalRoutes, currentModuleRoutes) => [...totalRoutes, ...currentModuleRoutes],
  [] as RouteRecordRaw[]
);

// 4. 兜底路由（匹配所有未定义路径，重定向到404）
const fallbackRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  redirect: '/404'
};

// 5. 最终路由配置（Layout作为根布局，子路由包含所有业务路由+兜底路由）
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'), // Layout懒加载（优化性能）
    children: [...businessRoutes, fallbackRoute]   // 合并业务路由+兜底路由
  }
];

// 6. 创建路由实例
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  // 可选：结合gsap实现页面切换时的平滑滚动（利用已注册的ScrollToPlugin）
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    // gsap平滑滚动到顶部
    gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
    return { top: 0 };
  }
});

export default router;