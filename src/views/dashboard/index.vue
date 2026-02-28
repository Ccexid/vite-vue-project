<script setup lang="ts">
  import type { SearchItem } from '@/types/search-box';

  // 原始数据池
  const options = ref<SearchItem[]>([]);
  // 搜索关键字状态
  const searchQuery = ref('');

  /**
   * 优化：使用 computed 替代手动维护 searchList
   * 1. 自动响应 searchQuery 和 options 的变化
   * 2. 避免了 query 为空时逻辑判断的冗余
   */
  const filteredList = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return options.value;

    return options.value.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query),
    );
  });

  /**
   * 接收子组件传来的关键字
   */
  const handleSearch = (query: string) => {
    searchQuery.value = query;
  };

  onMounted(() => {
    // 优化：直接赋值比循环 push 效率更高
    options.value = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      title: `选项 ${i + 1}`,
      description: `这是选项 ${i + 1} 的描述`,
    }));
  });
</script>

<template>
  <div class="dashboard-container">
    <h1>Hello Dashboard</h1>
    <SearchBox
      :options="filteredList"
      @search="handleSearch"
    />
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
    <ul>
      <li v-for="type in 100" :key="type">
        {{ type }} 按钮
      </li>
    </ul>
    <DarkCheckBox />
    <RouterLink to="/404">Go to 404</RouterLink>
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
