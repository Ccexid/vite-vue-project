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

  // 3. 主题映射：将 global.css 中的变量与 UnoCSS 语义类连接
  theme: {
    colors: {
      // 基础中性色
      background: 'hsl(var(--background))',
      'background-deep': 'hsl(var(--background-deep))',
      foreground: 'hsl(var(--foreground))',

      // 容器与装饰色
      card: 'hsl(var(--card))',
      'card-foreground': 'hsl(var(--card-foreground))',
      popover: 'hsl(var(--popover))',
      'popover-foreground': 'hsl(var(--popover-foreground))',
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',

      // 品牌与功能色
      // 这里支持 opacity 简写，例如：bg-primary/50
      primary: 'hsl(var(--primary))',
      'primary-foreground': 'hsl(var(--primary-foreground))',
      success: 'hsl(var(--success))',
      'success-foreground': 'hsl(var(--success-foreground))',
      warning: 'hsl(var(--warning))',
      'warning-foreground': 'hsl(var(--warning-foreground))',
      destructive: 'hsl(var(--destructive))',
      'destructive-foreground': 'hsl(var(--destructive-foreground))',

      // 布局相关
      header: 'hsl(var(--header))',
      sidebar: 'hsl(var(--sidebar))',
    },
    // 字体族映射
    fontFamily: {
      sans: 'var(--font-family)',
    },
    // 圆角映射
    borderRadius: {
      sm: 'calc(var(--radius) - 4px)',
      md: 'calc(var(--radius) - 2px)',
      DEFAULT: 'var(--radius)',
      lg: 'var(--radius)',
      xl: 'calc(var(--radius) + 4px)',
    },
  },

  // 4. 动态规则：自动处理 generatorColorVariables 生成的 50-950 阶梯色
  // 这样你就可以直接用 text-primary-500, bg-success-200 等
  rules: [
    [
      /^((?:bg|text|border|outline|ring)-(?:primary|success|warning|destructive|green|red|yellow))-(.*)$/,
      ([, prop, d]) => {
        const mapping: Record<string, string> = {
          bg: 'background-color',
          text: 'color',
          border: 'border-color',
          outline: 'outline-color',
          ring: 'ring-color',
        };
        // 提取属性名前缀 (如 bg, text)
        const type = prop.split('-')[0];
        // 提取颜色名称 (如 primary, success)
        const colorName = prop.replace(`${type}-`, '');
        return {
          [mapping[type]]: `hsl(var(--${colorName}-${d}))`,
        };
      },
    ],
  ],

  // 5. 快捷方式 (可选)：定义一些常用的复合类
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'card-box': 'bg-card text-card-foreground border border-border rounded-lg shadow-sm',
    'vben-link': 'text-primary hover:underline cursor-pointer transition-colors',
  },
});
