// src/router/index.ts (建议用ts后缀，更规范)
import { createWebHashHistory, createRouter, type RouteRecordRaw } from 'vue-router';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

/**
 * 路由配置说明：
 * 1. 统一使用 RouteRecordRaw 类型约束，提升类型校验
 * 2. 路由拆分：基础路由单独抽离，便于后续扩展
 * 3. 补充name属性，便于编程式导航（如router.push({name: 'Dashboard'})）
 * 4. 注释清晰，提升可维护性
 */

// 基础路由配置（抽离成常量，便于管理）
const routes: RouteRecordRaw[] = [
  // 首页/仪表盘
  {
    path: '/',
    name: 'Dashboard', // 补充name属性，语义化且便于导航
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘' // 补充meta，便于设置页面标题、权限控制等扩展场景
    }
  },
  // 404页面
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: '页面迷路啦~'
    }
  },
  // 兜底路由：匹配所有未定义的路径，重定向到404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    transition?: string;
    hidden?: boolean;
  }
}