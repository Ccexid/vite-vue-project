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
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_PATH || '/',

    plugins: [
      vue(),
      // 仅在开发环境开启代码定位
      !isProd && codeInspectorPlugin({ bundler: 'vite' }),

      // 优化 1: 类型检查移出主进程，防止构建卡顿
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
        dirs: ['src/composables', 'src/store'],
      }),

      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [IconsResolver()],
        directoryAsNamespace: true,
      }),

      // 优化 3: 压缩策略，同时生成 .gz 和 .br (Brotli 压缩率更高)
      isProd &&
        viteCompression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 10240,
          deleteOriginFile: false,
        }),

      // 只有在需要兼容旧版浏览器时开启，现代项目可考虑关闭以减小体积
      isProd &&
        legacy({
          targets: ['defaults', 'not IE 11'],
        }),

      Icons({
        autoInstall: true,
        compiler: 'vue3',
        scale: 1.2, // 稍微放大图标，视觉更佳
      }),
      UnoCSS(),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

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
      target: 'esnext', // 优化 4: 现代项目建议 esnext，产物更小更高效
      minify: 'terser',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      sourcemap: !isProd,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },

      rollupOptions: {
        output: {
          // 优化 5: 更精细的分包，解决 "Unused JS"
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 核心框架库（单独打包，长期缓存）
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vendor-framework';
              }
              // 这种重型工具包独立
              if (id.includes('gsap') || id.includes('lodash-es')) {
                return 'vendor-utils';
              }
              return 'vendor-libs';
            }
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    // 优化 6: 预构建排除不需要预编译的大型库，或者显式指定
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'naive-ui', 'vue-i18n', '@vueuse/core', 'axios'],
      exclude: ['gsap'], // gsap 比较大且是 ESM，可以考虑排除在预构建之外
    },
  };
});
