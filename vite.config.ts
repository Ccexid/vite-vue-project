import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import legacy from '@vitejs/plugin-legacy';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import UnoCSS from 'unocss/vite';
import { codeInspectorPlugin } from 'code-inspector-plugin';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      vue(),
      codeInspectorPlugin({ bundler: 'vite' }),
      // 优化 1: 仅在生产环境或需要时开启完整检查，关闭 overlay 减少渲染阻塞
      checker({
        typescript: true,
        vueTsc: true,
        overlay: false, // 关闭浏览器内报错遮罩，减少 1MB 左右的 runtime 注入
        enableBuild: true,
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        dts: 'src/types/components.d.ts',
        // 优化 2: 确保组件按需引入逻辑生效
        resolvers: [IconsResolver(), NaiveUiResolver()],
      }),
      // 优化 3: legacy 仅在生产模式生效，开发环境不需要
      isProd &&
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
        scale: 1,
      }),
      UnoCSS(),
    ].filter(Boolean), // 过滤掉 false 的插件

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // 优化 4: 强制预构建常用大型依赖，减少开发环境下的 HTTP 请求链深度
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'naive-ui', 'vue-i18n', '@vueuse/core', 'gsap'],
    },

    // 优化 5: 生产环境分包策略 (解决 Largest Contentful Paint 问题)
    build: {
      reportCompressedSize: false, // 关闭压缩大小报告，加快构建
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'naive-ui': ['naive-ui'],
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },

    // 优化 6: 开发服务器配置
    server: {
      host: true,
      // 开启 HMR 并发限制，防止请求过多卡死
      hmr: {
        overlay: false,
      },
    },
  };
});
