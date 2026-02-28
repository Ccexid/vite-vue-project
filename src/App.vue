<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'">
      <keep-alive>
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </keep-alive>
    </Transition>
  </RouterView>
</template>
