import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom', // 模拟浏览器环境
      globals: true, // 启用类似 jest 的全局 API
    },
  }),
);
