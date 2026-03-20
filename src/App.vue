<script setup lang="ts"></script>
<template>
  <RouterView v-slot="{ Component, route }">
    <template v-if="Component">
      <Transition name="out-in">
        <Component
          :key="route.fullPath"
          :is="Component"
        />
      </Transition>
    </template>
  </RouterView>
</template>
