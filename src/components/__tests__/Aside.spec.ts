import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { NMenu } from 'naive-ui';
import AppAside from '../app-aside/index.vue';

describe('AppAside.vue 侧边栏组件', () => {
  // 模拟菜单数据
  const mockMenuOptions = [
    { label: '仪表盘', key: 'dashboard' },
    { label: '用户管理', key: 'user' },
  ];

  const defaultProps = {
    isCollapsed: false,
    menuOptions: mockMenuOptions,
    activeKey: 'dashboard',
  };

  // 辅助函数：快速挂载组件
  const createWrapper = (props = {}) => {
    return mount(AppAside, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          // Mock 那些自动导入的图标组件，避免报错
          'i-ep-fold': true,
          'i-ep-expand': true,
          'n-menu': NMenu, // 或者直接 stub: { 'n-menu': true }
        },
      },
    });
  };

  it('展开状态下应显示 Logo 文字', () => {
    const wrapper = createWrapper({ isCollapsed: false });
    expect(wrapper.find('.logo-text').exists()).toBe(true);
    expect(wrapper.text()).toContain('Gemini Admin');
  });

  it('折叠状态下应隐藏 Logo 文字', () => {
    const wrapper = createWrapper({ isCollapsed: true });
    // 注意：v-if 结合 Transition 可能会延迟，但在 jsdom 中通常直接消失
    expect(wrapper.find('.logo-text').exists()).toBe(false);
  });

  it('点击切换按钮时应触发 toggle 事件', async () => {
    const wrapper = createWrapper();
    const btn = wrapper.find('.toggle-btn');

    await btn.trigger('click');

    // 检查是否派发了 'toggle' 事件
    expect(wrapper.emitted()).toHaveProperty('toggle');
  });

  it('点击菜单项时应触发 update:activeKey 事件', async () => {
    const wrapper = createWrapper();

    // 找到 Naive UI 的 NMenu 组件实例
    const menu = wrapper.getComponent(NMenu);

    // 模拟 NMenu 触发 update:value 事件
    await menu.vm.$emit('update:value', 'user', { label: '用户管理', key: 'user' });

    // 检查父组件是否同步派发了事件
    const emitted = wrapper.emitted('update:activeKey');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(['user', { label: '用户管理', key: 'user' }]);
  });

  it('折叠状态下图标应切换为 expand', () => {
    const wrapper = createWrapper({ isCollapsed: true });
    // 检查 stub 后的图标是否存在
    expect(wrapper.find('i-ep-expand-stub').exists()).toBe(true);
  });
});
