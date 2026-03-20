// 定义路由地址
import {
  createRouter,
  createWebHashHistory,
  type LocationQuery,
  type LocationQueryValue,
  type RouteRecordRaw,
} from 'vue-router';
import qs from 'qs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 路由配置数组，用于存储应用的所有路由规则
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/home',
        component: () => import('@/pages/home/page.vue'),
        name: 'homePage',
      },
      {
        path: '/about',
        component: () => import('@/pages/about/page.vue'),
        name: 'aboutPage',
      },
    ],
  },
];

/**
 * 适配器函数：将 qs 解析的结果转换为 Vue Router 兼容的 LocationQuery
 * @param search - URL 中的查询参数字符串（包含 ? 或不包含 ?）
 * @returns 符合 Vue Router 规范的 LocationQuery 对象
 */
const customParseQuery = (search: string): LocationQuery => {
  // 1. 使用 qs 解析字符串
  const result = qs.parse(search.replace(/^\?/, ''));

  const query: LocationQuery = {};

  // 2. 遍历并清洗数据，确保符合 LocationQueryValue 类型
  Object.keys(result).forEach((key) => {
    const value = result[key];

    if (Array.isArray(value)) {
      // 如果是数组，过滤掉 null，并将所有项转为 string 或 null
      query[key] = value.map((v) => (v === undefined ? null : v) as LocationQueryValue);
    } else {
      // 如果是单值，undefined 转为 null (Vue Router 代表无值的 key)
      query[key] = (value === undefined ? null : value) as LocationQueryValue;
    }
  });

  return query;
};

// 创建 Vue Router 实例
const router = createRouter({
  // 使用 hash 模式的历史记录，适用于不支持 HTML5 History API 的环境
  history: createWebHashHistory(),
  // 路由配置数组
  routes,
  // 自定义查询参数解析函数，使用 qs 库解析复杂查询参数
  parseQuery: customParseQuery,
  // 自定义查询参数序列化函数，将查询对象转换为 URL 字符串
  stringifyQuery: (obj) => {
    // 使用 qs 库序列化对象，跳过 null 值以生成更简洁的 URL
    const result = qs.stringify(obj, { skipNulls: true });
    // 如果序列化结果不为空，添加 ? 前缀，否则返回空字符串
    return result ? `?${result}` : '';
  },
  // 滚动行为配置，切换路由时自动滚动到页面顶部并启用平滑滚动
  scrollBehavior: () => ({ top: 0, smooth: true }),
});

// 路由守卫：在每次路由切换前触发
router.beforeEach(() => {
  // 开始进度条动画
  NProgress.start();
});

// 路由守卫：在每次路由切换后触发
router.afterEach(() => {
  // 完成进度条动画
  NProgress.done();
});

// 导出路由实例供应用使用
export default router;
