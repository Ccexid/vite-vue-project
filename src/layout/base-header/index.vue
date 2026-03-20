<script setup lang="ts">
  defineOptions({
    name: 'BaseHeader',
  });
</script>
<template>
  <header class="h-64px px-24px flex justify-between py-0 box-border">
    <div class="flex items-center gap-10px flex-shrink-0">
      <slot name="logo"></slot>
      <slot name="left-nav"></slot>
    </div>
  </header>
</template>
