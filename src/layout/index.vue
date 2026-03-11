<script setup lang="ts"></script>

<template>
  <NLayout
    ref="layoutRef"
    :native-scrollbar="false"
    position="absolute"
  >
    <NLayoutHeader>
      <div class="flex">
        <header>
          1
        </header>
      </div>
    </NLayoutHeader>
    <NLayoutContent>
      <RouterView v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </RouterView>
    </NLayoutContent>
    
  </NLayout>
</template>

<style lang="less" scoped></style>
