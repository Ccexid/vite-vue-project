<script setup lang="ts">
  import { DarkToggleButton, FullScreenButton } from '@/components';
</script>

<template>
  <NLayout
    :native-scrollbar="false"
    class="h-full w-full"
  >
    <NLayoutHeader
      class="h-64px w-full sticky top-0 z-10 px-12px"
      bordered
    >
      <NGrid
        class="h-64px w-full"
        item-responsive
        :cols="5"
        :x-gap="12"
      >
        <NGridItem>
          <div class="w-full h-full flex items-center">
            <NGradientText
              type="primary"
              size="18px"
            >
              VueAdmin
            </NGradientText>
          </div>
        </NGridItem>
        <NGridItem span="3">
          <div class="light-green">2</div>
        </NGridItem>
        <NGridItem>
          <div class="w-full h-full flex items-center justify-end gap-8px">
            <FullScreenButton />
            <DarkToggleButton />
          </div>
        </NGridItem>
      </NGrid>
    </NLayoutHeader>
    <NLayout
      position="absolute"
      class="top-64px bottom-0 w-full h-full"
    >
      <NLayoutContent
        content-style="padding: 20px;"
        :native-scrollbar="false"
        position="absolute"
      >
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
  </NLayout>
</template>
