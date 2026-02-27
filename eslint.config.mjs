// eslint.config.mjs (建议使用 .mjs 后缀或确保 package.json 中 type: "module")
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
// 修正点 1: 建议使用 skip-formatting 导出，以避免 ESLint 去校验格式，完全交给 Prettier
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default defineConfigWithVueTs(
  // 1. 全局忽略 (注意：单独一个 ignores 对象的配置项会被视为全局忽略)
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', 'stats.html','.history/**'],
  },

  // 2. 继承 Vue 和 TS 的推荐规则
  ...pluginVue.configs["flat/essential"],

  // vueTsConfigs.recommended 返回的是单个配置对象，直接传入即可
  vueTsConfigs.recommended,

  // 3. 自定义业务规则
  {
    // 指定应用范围
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'vue/multi-word-component-names': 'off', // 允许单单词组件名
      '@typescript-eslint/no-explicit-any': 'warn', // 禁止过度使用 any
      // 修正点 2: 在 Flat Config 中，建议直接写规则，process 环境判断依然可用
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  },

  // 4. 必须放在最后：禁用与 Prettier 冲突的规则
  // skipFormatting 本身就是一个配置对象，直接传入
  skipFormatting,
);
