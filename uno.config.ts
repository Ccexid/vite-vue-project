import {
  defineConfig,
  presetAttributify,
  presetUno, // 推荐使用 presetUno 代替 presetMini + presetWind3
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  // 1. 预设配置
  presets: [
    // presetUno 是通用预设，它包含了缩减版的 Wind3 (Tailwind) 和 Mini
    // 使用它能避免 presetMini 和 presetWind3 之间的某些类名冲突
    presetUno(),
    presetAttributify(),
    presetIcons({
      // 优化点：不要使用 /browser。在 Vite 项目中，直接利用构建时加载更高效
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  // 3. 转换器配置
  transformers: [
    transformerDirectives(), // 支持 @apply
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
