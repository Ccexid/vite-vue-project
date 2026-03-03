<script setup lang="ts"></script>

<template>
  <div class="dashboard-container">
    <h1>Hello Dashboard</h1>
    <div class="btn-group">
      <n-tag>爱在西元前</n-tag>
      <n-tag type="warning">超人不会飞</n-tag>
    </div>
    <div class="btn-group">
      <NButton size="large">默认按钮大</NButton>
      <NButton size="small">默认按钮小</NButton>
      <NButton>默认按钮</NButton>
      <NButton type="primary">primary按钮</NButton>
      <NButton type="success">成功按钮</NButton>
      <NButton type="warning">警告按钮</NButton>
      <NButton type="error">危险按钮</NButton>
      <NButton type="info">Info按钮</NButton>
      <NButton disabled>禁用按钮</NButton>
      <NButton loading>加载中按钮</NButton>
      <NButton nativeType="submit">提交按钮</NButton>
      <NButton nativeType="reset">重置按钮</NButton>
      <NButton plain>朴素按钮</NButton>
      <NButton
        type="primary"
        plain
      >
        朴素按钮
      </NButton>
      <NButton
        type="success"
        plain
      >
        朴素按钮
      </NButton>
      <NButton
        type="warning"
        plain
      >
        朴素按钮
      </NButton>
      <NButton
        type="error"
        plain
      >
        朴素按钮
      </NButton>
      <NButton
        type="info"
        plain
      >
        朴素按钮
      </NButton>
      <NButton circle>
        <IEpSearch />
      </NButton>
      <NButton round>圆角按钮</NButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .dashboard-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
  }
</style>
