<script setup lang="ts">
  defineOptions({
    name: 'AboutPage',
  });
</script>
<template>
  <div>About</div>
  <RouterLink
    to="/"
    :replace="true"
  >
    Home
  </RouterLink>
</template>
