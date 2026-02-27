/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vue-virtual-scroller' {
    import { DefineComponent, Plugin } from 'vue'

    /**
     * 基础作用域插槽参数接口
     */
    export interface ScrollerSlotProps<T> {
        item: T        // 当前渲染的数据项
        index: number  // 数据项在数组中的索引
        active: boolean // 视图是否激活（非激活状态应避免重渲染）
    }

    /**
     * RecycleScroller 组件的 Props
     */
    export interface RecycleScrollerProps<T = any> {
        items: T[]                            // [必填] 要显示的列表数据源
        direction?: 'vertical' | 'horizontal' // 滚动方向：'vertical'(垂直) 或 'horizontal'(水平)
        itemSize?: number | null              // 项目高度/宽度（像素）。若为 null 则开启变量尺寸模式
        gridItems?: number                    // 网格布局：每行显示的项数（需配合 itemSize）
        itemSecondarySize?: number            // 网格布局：项目在交叉轴上的尺寸
        minItemSize?: number | string         // 最小尺寸：当项目高度未知时的预估值
        sizeField?: string                    // 变量尺寸模式下，获取尺寸的字段名（默认 'size'）
        typeField?: string                    // 字段名：用于区分不同类型的组件以实现池化复用（默认 'type'）
        keyField?: string                     // 唯一标识字段名：用于优化视图渲染（默认 'id'）
        pageMode?: boolean                    // 页面模式：为 true 时使用浏览器窗口滚动而非容器滚动
        prerender?: number                    // 服务端渲染(SSR)时预渲染的项目数量
        buffer?: number                       // 缓冲区像素：视图外额外渲染的范围，减少滚动白屏（默认 200）
        emitUpdate?: boolean                  // 是否在视图更新时触发 'update' 事件（开启可能影响性能）
        updateInterval?: number               // 更新频率：滚动后检查更新的时间间隔（毫秒）
        listClass?: string                    // 添加到列表包裹元素（wrapper）上的 CSS 类名
        itemClass?: string                    // 添加到每个项目元素上的 CSS 类名
        listTag?: string                      // 列表包裹元素的 HTML 标签（默认 'div'）
        itemTag?: string                      // 项目元素的 HTML 标签（默认 'div'）
    }

    /**
     * RecycleScroller 组件定义 (固定高度列表)
     * 核心逻辑：复用 DOM 节点以保证极高性能
     */
    export const RecycleScroller: DefineComponent<
        RecycleScrollerProps,
        Record<string, never>,
        Record<string, never>,
        Record<string, never>,
        {
            default: (props: ScrollerSlotProps<any>) => any // 默认插槽：渲染每个项目
            before: () => any                               // 头部插槽：在列表内容前插入内容
            after: () => any                                // 尾部插槽：在列表内容后插入内容
            empty: () => any                                // 空状态插槽：列表为空时显示
        }
    >

    /**
     * DynamicScroller 组件的 Props
     */
    export interface DynamicScrollerProps<T = any> extends RecycleScrollerProps<T> {
        minItemSize: number | string // [必填] 用于初始渲染的预估最小高度
    }

    /**
     * DynamicScroller 组件定义 (动态高度列表)
     * 核心逻辑：自动发现并缓存项目尺寸
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
     * 必须作为 DynamicScroller 的直接子组件使用
     */
    export interface DynamicScrollerItemProps<T = any> {
        item: T                       // [必填] 当前渲染的数据项
        active: boolean               // [必填] 视图是否激活（直接透传作用域插槽中的 active）
        sizeDependencies?: any[]      // 尺寸依赖项：数组内的值变化时会重新计算高度（比 watchData 性能更好）
        watchData?: boolean           // 深度监听：是否深度监听 item 变化来更新高度（不建议开启，影响性能）
        tag?: string                  // 渲染的 HTML 标签（默认 'div'）
        emitResize?: boolean          // 是否在尺寸变化时触发 'resize' 事件
    }

    export const DynamicScrollerItem: DefineComponent<DynamicScrollerItemProps>

    /**
     * IdState Mixin：解决复用组件内部状态共享问题的工具
     */
    export function IdState(options?: {
        idProp?: (vm: any) => any // 标识符获取函数，默认取 vm.item.id
    }): any

    const plugin: Plugin
    export default plugin
}