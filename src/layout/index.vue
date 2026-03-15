<script setup lang="ts">
  import { DarkToggleButton, FullScreenButton, LangSelectButton } from '@/components';
  // 建议定义一个响应式宽度常量，方便多处复用
  const contentMaxWidth = '1300px';
</script>

<template>
  <NLayout
    :native-scrollbar="false"
    class="min-h-screen bg-[#f1f2f3] dark:bg-[#101014]"
  >
    <NLayoutHeader
      class="h-64px w-full sticky top-0 z-100 px-20px flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md"
      bordered
    >
      <div
        :style="{ maxWidth: contentMaxWidth }"
        class="w-full flex items-center justify-between"
      >
        <div class="flex items-center cursor-pointer">
          <NGradientText
            type="primary"
            size="22px"
            class="font-bold"
          >
            VueVideo
          </NGradientText>
          <div class="ml-24px flex gap-16px text-14px">
            <NButton text>首页</NButton>
            <NButton text>番剧</NButton>
            <NButton text>直播</NButton>
          </div>
        </div>

        <div class="flex-1 max-w-500px px-40px">
          <NInput
            round
            :placeholder="$t('common.searchPlaceholder')"
            clearable
          >
            <template #suffix>
              <IStreamlineSearchVisual />
            </template>
          </NInput>
        </div>

        <div class="flex items-center gap-16px">
          <LangSelectButton />
          <DarkToggleButton />
          <FullScreenButton />
          <NAvatar
            round
            size="medium"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            class="ml-8px cursor-pointer"
          />
        </div>
      </div>
    </NLayoutHeader>

    <NLayoutContent
      class="bg-transparent"
      content-style="padding-top: 24px; padding-bottom: 60px;"
    >
      <div
        :style="{ maxWidth: contentMaxWidth }"
        class="mx-auto w-full px-20px"
      >
        <RouterView v-slot="{ Component, route }">
          <Transition
            name="fade-slide"
            mode="out-in"
          >
            <keep-alive>
              <component
                :is="Component"
                :key="route.fullPath"
              />
            </keep-alive>
          </Transition>
        </RouterView>
      </div>
    </NLayoutContent>

    <NBackTop
      :right="40"
      :bottom="40"
    />
  </NLayout>
</template>

<style scoped>
  /* 优化路由切换动画，使其更平滑 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
