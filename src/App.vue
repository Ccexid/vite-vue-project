<script setup lang="ts"></script>
<template>
  <RouterView v-slot="{ Component, route }">
    <template v-if="Component">
      <Transition name="out-in">
        <KeepAlive>
          <Component
            :key="route.fullPath"
            :is="Component"
          />
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
