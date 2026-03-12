<script setup lang="ts"></script>

<template>
  <NLayout
    ref="layoutRef"
    embedded
    content-style="width: 100%;height: 100%;"
  >
    <NLayoutHeader content-style="height: 64px">
      <div class="h-64px shadow-card">111</div>
    </NLayoutHeader>

    <NLayoutContent content-style="padding: 20px;width: 100%;height: 100%;">
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="fade-slide"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="route.fullPath"
          />
        </Transition>
      </RouterView>
    </NLayoutContent>
  </NLayout>
</template>
