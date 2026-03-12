<script setup lang="ts">
  import { useDark } from '@vueuse/core';

  const isDark = useDark();

  defineOptions({
    name: 'DarkToggleButton',
  });

  const toggle = () => {
    isDark.value = !isDark.value;
  };
</script>
<template>
  <NButton
    type="primary"
    text
    circle
    @click="toggle"
  >
    <template #icon>
      <ILineMdSunRisingLoop v-if="!isDark" />
      <ILineMdSunnyOutlineToMoonAltLoopTransition v-else />
    </template>
  </NButton>
</template>
