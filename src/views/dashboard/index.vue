<script setup lang="ts"></script>

<template>
  <div class="dashboard-container">
    <h1>Hello Dashboard</h1>
    <div class="btn-group">
      <n-tag>爱在西元前</n-tag>
      <n-tag type="warning">超人不会飞</n-tag>
    </div>
    <div class="btn-group">
      <NBtn size="large">默认按钮大</NBtn>
      <NBtn size="small">默认按钮小</NBtn>
      <NBtn>默认按钮</NBtn>
      <NBtn type="primary">primary按钮</NBtn>
      <NBtn type="success">成功按钮</NBtn>
      <NBtn type="warning">警告按钮</NBtn>
      <NBtn type="danger">危险按钮</NBtn>
      <NBtn type="info">Info按钮</NBtn>
      <NBtn disabled>禁用按钮</NBtn>
      <NBtn loading>加载中按钮</NBtn>
      <NBtn nativeType="submit">提交按钮</NBtn>
      <NBtn nativeType="reset">重置按钮</NBtn>
      <NBtn plain>朴素按钮</NBtn>
      <NBtn
        type="primary"
        plain
      >
        朴素按钮
      </NBtn>
      <NBtn
        type="success"
        plain
      >
        朴素按钮
      </NBtn>
      <NBtn
        type="warning"
        plain
      >
        朴素按钮
      </NBtn>
      <NBtn
        type="danger"
        plain
      >
        朴素按钮
      </NBtn>
      <NBtn
        type="info"
        plain
      >
        朴素按钮
      </NBtn>
      <NBtn circle>
        <IEpSearch />
      </NBtn>
      <NBtn round>圆角按钮</NBtn>
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
