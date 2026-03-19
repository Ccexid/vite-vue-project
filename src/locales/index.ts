/* eslint-disable @typescript-eslint/no-explicit-any */
import { createI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

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
const zhModules = import.meta.glob<MessageRecord>('./lang/zh-CN/**/*.ts', { eager: true });
const enModules = import.meta.glob<MessageRecord>('./lang/en/**/*.ts', { eager: true });

// 3. 构建消息对象
const messages = {
  'zh-CN': getLocaleMessages(zhModules, 'zh-CN'),
  en: getLocaleMessages(enModules, 'en'),
};

// 4. 持久化存储
const savedLocale = useStorage('selected-lang', 'zh-CN');

const setDayjsLocale = (lang: string) => {
  // 注意：dayjs 的简体中文 key 是 'zh-cn'，通常需要做一次转换
  const dayjsLang = lang.toLowerCase() === 'zh-cn' ? 'zh-cn' : 'en';
  dayjs.locale(dayjsLang);
};

setDayjsLocale(savedLocale.value);

watch(savedLocale, (val) => {
  setDayjsLocale(val);
});

// 5. 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: savedLocale.value,
  fallbackLocale: 'en',
  messages: messages as any, // 强制断言为 any，切断递归路径推导
  globalInjection: true,
});

export default i18n as any;
