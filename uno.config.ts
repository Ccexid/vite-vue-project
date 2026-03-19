import { defineConfig, transformerVariantGroup } from 'unocss';
import presetWind4 from '@unocss/preset-wind4';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  // 1. 预设配置
  presets: [
    presetWind4({
      reset: true,
    }),
    presetIcons({
      scale: 1,
      warn: true,
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  // 3. 转换器配置
  transformers: [
    transformerVariantGroup(), // 支持 hover:(bg-gray-100 text-red)
  ],

  // 4. 内容提取配置 (确保扫描到 Vue 和 TS 文件)
  content: {
    pipeline: {
      exclude: ['node_modules', '.git', 'dist'],
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/, 'src/**/*.{js,ts}'],
    },
  },
});
