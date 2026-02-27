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
    
    return options.value.filter((item) => 
      item.title.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query)
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
    options.value = Array.from({ length: 100000 }, (_, i) => ({
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
    <RouterLink to="/404">Go to 404</RouterLink>
  </div>
</template>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;
}
</style>