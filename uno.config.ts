// uno.config.ts
import { defineConfig, presetMini, presetWind3, presetAttributify } from 'unocss';

export default defineConfig({
    // ...UnoCSS选项
    presets: [
        presetMini(),
        presetWind3(),
        presetAttributify(),
        // ...其他预设
    ],
})