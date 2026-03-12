import {
  defineConfig,
  presetAttributify,
  presetMini,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  // 1. 预设配置
  presets: [
    presetMini(),
    presetWind3(), // Wind3 包含了大部分 Tailwind/Windi 的兼容类
    presetAttributify(),
  ],

  // 2. 转换器配置：支持 @apply 和 变体分组 (如 hover:(bg-primary text-white))
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
