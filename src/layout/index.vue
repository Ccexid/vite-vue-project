<script setup lang="ts">
  defineOptions({
    name: 'Layout',
  });
</script>
<template>
  <div class="layout-wrapper">
    <main class="layout-main">
      <RouterView v-slot="{ Component, route }">
        <template v-if="Component">
          <Transition
            mode="out-in"
            name="fade-transform"
          >
            <Component
              :key="route.fullPath"
              :is="Component"
            />
          </Transition>
        </template>
      </RouterView>
    </main>
  </div>
</template>
<style lang="less" scoped>
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-transform-enter-from,
  .fade-transform-leave-to {
    opacity: 0;
  }
</style>
