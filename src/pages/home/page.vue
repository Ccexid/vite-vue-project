<script setup lang="ts">
  defineOptions({
    name: 'HomePage',
  });
  const total = ref(1000);
</script>
<template>
  <div>Home</div>
  <RouterLink to="/about">About</RouterLink>
  <div>
    <p
      v-for="item in total"
      :key="item"
    >
      Home-{{ item }}
    </p>
  </div>
</template>
