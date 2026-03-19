import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import legacy from '@vitejs/plugin-legacy';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import UnoCSS from 'unocss/vite';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import viteCompression from 'vite-plugin-compression'; // 新增：压缩插件

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const env = loadEnv(mode, process.cwd()); // 加载环境变量

  return {
    // 优化 1: 生产环境基础路径（根据实际部署调整）
    base: env.VITE_BASE_PATH || '/',

    plugins: [
      vue(),
      codeInspectorPlugin({ bundler: 'vite' }),

      // 优化 2: 仅在开发环境开启类型检查，避免阻塞构建流程
      !isProd &&
        checker({
          typescript: true,
          vueTsc: true,
          overlay: false,
        }),

      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          'vue-i18n',
          '@vueuse/core',
          { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] },
        ],
        dts: 'src/types/auto-imports.d.ts',
        // 优化 3: 自动导入自定义目录下的模块
        dirs: ['src/composables', 'src/store'],
      }),

      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [IconsResolver()],
        directoryAsNamespace: true, // 优化 4: 允许同名组件在不同子目录下
      }),

      // 优化 5: 生产环境开启 Gzip 压缩
      isProd &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240, // 超过 10kb 则压缩
          algorithm: 'gzip',
          ext: '.gz',
        }),

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
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // 优化 6: 开发服务器配置
    server: {
      host: true,
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      target: 'es2015', // 优化 7: 现代浏览器目标
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      sourcemap: !isProd, // 生产环境关闭 sourcemap 减少体积

      // 优化 8: 移除生产环境 log
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },

      rollupOptions: {
        output: {
          // 优化 9: 更科学的分包策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('naive-ui')) return 'ui-naive';
              if (id.includes('gsap') || id.includes('lodash-es')) return 'utils-heavy';
              if (id.includes('vue') || id.includes('pinia') || id.includes('router'))
                return 'vendor-core';
              return 'vendor-others';
            }
          },
          // 优化 10: 资源文件分类存放
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core', 'gsap', 'axios'],
    },
  };
});
