/* eslint-disable @typescript-eslint/no-explicit-any */
import { createI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';

// 1. 定义一个松散的消息记录类型，避免 TS 进行深层递归推导
type MessageRecord = Record<string, any>;

/**
 * 辅助函数：将路径数组转换为嵌套对象
 * 例如：['order', 'detail'] -> { order: { detail: { ... } } }
 */
const setNestedModule = (target: MessageRecord, paths: string[], content: any) => {
  let current = target;
  paths.forEach((path, index) => {
    if (index === paths.length - 1) {
      current[path] = content;
    } else {
      if (!current[path]) current[path] = {};
      current = current[path];
    }
  });
};

/**
 * 自动化合并多级目录模块
 */
const getLocaleMessages = (modules: Record<string, any>, langPath: string) => {
  const messages: MessageRecord = {};

  Object.keys(modules).forEach((key) => {
    // 匹配路径逻辑：支持多级子目录
    const regex = new RegExp(`./lang/${langPath}/(.*)\\.ts`);
    const matched = key.match(regex);

    if (matched && matched[1]) {
      const modulePath = matched[1];
      const moduleContent = modules[key]?.default;

      if (moduleContent) {
        const pathNodes = modulePath.split('/');
        setNestedModule(messages, pathNodes, moduleContent);
      }
    }
  });

  return messages;
};

// 2. 使用 import.meta.glob 批量导入
// 此处保持 MessageRecord 类型，它是 Record<string, any>，不会触发深层推导
const zhModules = import.meta.glob<MessageRecord>('./lang/zh-CN/**/*.ts', { eager: true });
const enModules = import.meta.glob<MessageRecord>('./lang/en/**/*.ts', { eager: true });

// 3. 构建消息对象
const messages = {
  'zh-CN': getLocaleMessages(zhModules, 'zh-CN'),
  'en': getLocaleMessages(enModules, 'en'),
};

// 4. 持久化存储
const savedLocale = useStorage('selected-lang', 'zh-CN');

// 5. 创建 i18n 实例
// 【关键修改】：将 i18n 实例本身或其配置项进行类型降级（断言为 any）
// 这能阻止 vue-i18n 尝试去解析 messages 里的每一个嵌套 key
const i18n = createI18n({
  legacy: false,
  locale: savedLocale.value,
  fallbackLocale: 'en',
  messages: messages as any, // 强制断言为 any，切断递归路径推导
  globalInjection: true,
});

// 【关键修改】：导出时也使用 any 包装，防止在 router 或组件中使用 i18n.global.t 时报错
export default i18n as any;