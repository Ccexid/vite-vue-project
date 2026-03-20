<script setup lang="ts"></script>
<template>
  <RouterView v-slot="{ Component, route }">
    <template v-if="Component">
      <Transition name="out-in">
        <KeepAlive>
          <Suspense>
            <Component
              :key="route.fullPath"
              :is="Component"
            />
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
