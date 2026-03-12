<script setup lang="ts">
  import { NGi } from 'naive-ui';
</script>

<template>
  <NGrid
    x-gap="12"
    :cols="4"
  >
    <NGi
      v-for="i in 4"
      :key="i"
    >
      <div class="h-full w-full">
        <NCard>
          <template #header>
            <div class="text-lg font-bold">Dashboard</div>
          </template>
          <NButton type="primary">Primary Button</NButton>
        </NCard>
      </div>
    </NGi>
  </NGrid>
</template>

<style lang="less" scoped></style>
