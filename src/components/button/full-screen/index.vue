<script setup lang="ts">
  import { useFullscreen } from '@vueuse/core';

  const { isFullscreen, toggle } = useFullscreen();

  defineOptions({
    name: 'FullScreenButton',
  });
</script>
<template>
  <NButton
    type="primary"
    text
    circle
    @click="toggle"
  >
    <template #icon>
      <IRiFullscreenLine v-if="!isFullscreen" />
      <IRiFullscreenExitLine v-else />
    </template>
  </NButton>
</template>
