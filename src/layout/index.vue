<script setup lang="ts"></script>

<template>
  <n-layout
    ref="layoutRef"
    position="absolute"
  >
    <NLayoutContent content-class="content-container">
      <RouterView v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </RouterView>
    </NLayoutContent>
  </n-layout>
</template>

<style lang="less" scoped></style>
