/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vue-virtual-scroller' {
    import { DefineComponent, Plugin } from 'vue'

    /**
     * 基础作用域插槽参数接口
     */
    export interface ScrollerSlotProps<T> {
        item: T
        index: number
        active: boolean
    }

    /**
     * RecycleScroller 组件的 Props
     */
    export interface RecycleScrollerProps<T = any> {
        items: T[]
        direction?: 'vertical' | 'horizontal'
        itemSize?: number | null
        gridItems?: number
        itemSecondarySize?: number
        minItemSize?: number | string
        sizeField?: string
        typeField?: string
        keyField?: string
        pageMode?: boolean
        prerender?: number
        buffer?: number
        emitUpdate?: boolean
        updateInterval?: number
        listClass?: string
        itemClass?: string
        listTag?: string
        itemTag?: string
    }

    /**
     * RecycleScroller 组件定义
     */
    export const RecycleScroller: DefineComponent<
        RecycleScrollerProps,
        Record<string, never>,
        Record<string, never>,
        Record<string, never>,
        {
            // 定义作用域插槽，以便在模板中获得 item 的类型提示
            default: (props: ScrollerSlotProps<any>) => any
            before: () => any
            after: () => any
            empty: () => any
        }
    >

    /**
     * DynamicScroller 组件的 Props
     * 继承自 RecycleScroller 所有的 Props
     */
    export interface DynamicScrollerProps<T = any> extends RecycleScrollerProps<T> {
        minItemSize: number | string // 在 DynamicScroller 中是必填项
    }

    /**
     * DynamicScroller 组件定义
     */
    export const DynamicScroller: DefineComponent<
        DynamicScrollerProps,
        Record<string, never>,
        Record<string, never>,
        Record<string, never>,
        {
            default: (props: ScrollerSlotProps<any>) => any
            before: () => any
            after: () => any
            empty: () => any
        }
    >

    /**
     * DynamicScrollerItem 组件的 Props
     */
    export interface DynamicScrollerItemProps<T = any> {
        item: T
        active: boolean
        sizeDependencies?: any[]
        watchData?: boolean
        tag?: string
        emitResize?: boolean
    }

    /**
     * DynamicScrollerItem 组件定义
     */
    export const DynamicScrollerItem: DefineComponent<DynamicScrollerItemProps>

    /**
     * IdState Mixin 的参数与定义
     */
    export function IdState(options?: {
        idProp?: (vm: any) => any
    }): any

    const plugin: Plugin
    export default plugin
}