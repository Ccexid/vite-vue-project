<script setup lang="ts"></script>

<template>
  <div class="dashboard-container">
    <h1>Hello Dashboard</h1>
    <div class="btn-group">
      <AppBtn size="large">默认按钮大</AppBtn>
      <AppBtn size="small">默认按钮小</AppBtn>
      <AppBtn>默认按钮</AppBtn>
      <AppBtn type="primary">primary按钮</AppBtn>
      <AppBtn type="success">成功按钮</AppBtn>
      <AppBtn type="warning">警告按钮</AppBtn>
      <AppBtn type="danger">危险按钮</AppBtn>
      <AppBtn type="info">Info按钮</AppBtn>
      <AppBtn disabled>禁用按钮</AppBtn>
      <AppBtn loading>加载中按钮</AppBtn>
      <AppBtn nativeType="submit">提交按钮</AppBtn>
      <AppBtn nativeType="reset">重置按钮</AppBtn>
      <AppBtn plain>朴素按钮</AppBtn>
      <AppBtn
        type="primary"
        plain
      >
        朴素按钮
      </AppBtn>
      <AppBtn
        type="success"
        plain
      >
        朴素按钮
      </AppBtn>
      <AppBtn
        type="warning"
        plain
      >
        朴素按钮
      </AppBtn>
      <AppBtn
        type="danger"
        plain
      >
        朴素按钮
      </AppBtn>
      <AppBtn
        type="info"
        plain
      >
        朴素按钮
      </AppBtn>
      <AppBtn circle>
        <IEpSearch />
      </AppBtn>
      <AppBtn round>圆角按钮</AppBtn>
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
