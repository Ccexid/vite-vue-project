<script setup lang="ts"></script>

<template>
  <NLayout
    ref="layoutRef"
    :native-scrollbar="false"
  >
    <NLayoutHeader>颐和园路</NLayoutHeader>
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
