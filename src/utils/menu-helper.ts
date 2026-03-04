// utils/menu-helper.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type RouteRecordRaw } from 'vue-router';
import { type MenuOption } from 'naive-ui';
import type { SearchItem } from '@/types/search-box';

/**
 * 将路由配置转换为 Naive UI 菜单选项
 * @param routes 路由记录
 * @param t 国际化函数
 * @returns 菜单选项数组
 */
export function mapRouterToMenu(routes: RouteRecordRaw[], t: (key: string) => string): MenuOption[] {
    return routes
        .filter(route => !route.meta?.hidden) // 过滤掉隐藏的路由
        .map(route => {
            const menuOption: MenuOption = {
                // 使用路由的 name 作为 key，确保与 router.push 对应
                key: (route.name as string) || route.path,
                // 渲染国际化标签
                label: route.meta?.title ? () => t(route.meta?.title as string) : (route.name as string),
                // 渲染图标
                icon: route.meta?.icon as any,
            };

            // 递归处理子路由
            if (route.children && route.children.length > 0) {
                const children = mapRouterToMenu(route.children, t);
                if (children.length > 0) {
                    menuOption.children = children;
                }
            }

            return menuOption;
        });
}

/**
 * 将路由配置转换为 SearchBox 所需的 SearchItem 数组
 * @param routes 路由记录数组
 * @param t 国际化转换函数 (useI18n().t)
 * @param parentTitle 父级标题（用于拼接描述，可选）
 */
export function transformRoutesToSearchItems(
    routes: RouteRecordRaw[],
    t: (key: string) => string,
    parentTitle: string = ''
): SearchItem[] {
    const items: SearchItem[] = [];

    for (const route of routes) {
        // 跳过标记为隐藏的路由
        if (route.meta?.hidden) continue;

        const currentTitle = route.meta?.title ? t(route.meta.title as string) : (route.name as string || '');

        // 只有具有 name 的路由才可以被跳转，因此才加入搜索选项
        if (route.name) {
            items.push({
                id: route.name as string, // 使用 name 作为唯一 ID
                title: currentTitle,
                // 描述可以显示其父级路径，方便用户识别位置
                description: parentTitle ? `${parentTitle} > ${currentTitle}` : currentTitle,
            });
        }

        // 如果有子路由，递归处理
        if (route.children && route.children.length > 0) {
            const childItems = transformRoutesToSearchItems(
                route.children,
                t,
                currentTitle
            );
            items.push(...childItems);
        }
    }

    return items;
}