<script setup lang="ts">
  const queryForm = reactive({
    projectName: '',
    categories: [],
  });
  const options = [
    {
      label: "Everybody's Got Something to Hide Except Me and My Monkey",
      value: 'song0',
      disabled: true,
    },
    {
      label: 'Drive My Car',
      value: 'song1',
    },
    {
      label: 'Norwegian Wood',
      value: 'song2',
    },
    {
      label: "You Won't See",
      value: 'song3',
      disabled: true,
    },
    {
      label: 'Nowhere Man',
      value: 'song4',
    },
    {
      label: 'Think For Yourself',
      value: 'song5',
    },
    {
      label: 'The Word',
      value: 'song6',
    },
    {
      label: 'Michelle',
      value: 'song7',
      disabled: true,
    },
    {
      label: 'What goes on',
      value: 'song8',
    },
    {
      label: 'Girl',
      value: 'song9',
    },
    {
      label: "I'm looking through you",
      value: 'song10',
    },
    {
      label: 'In My Life',
      value: 'song11',
    },
    {
      label: 'Wait',
      value: 'song12',
    },
  ];
</script>

<template>
  <NFlex vertical class="dashboard-wrapper">
    <NForm
      ref="queryFormRef"
      :model="queryForm"
      :inline="true"
      class="app-form"
    >
      <NFormItem
        class="app-form-item"
        path="projectName"
      >
        <NSelect
          v-model:value="queryForm.projectName"
          :options="options"
        />
      </NFormItem>
      <NFormItem
        class="app-form-item"
        path="categories"
      >
        <NSelect
          v-model:value="queryForm.categories"
          :options="options"
          max-tag-count="responsive"
          multiple
        />
      </NFormItem>
    </NForm>
  </NFlex>
</template>

<style lang="less" scoped>
  .dashboard-wrapper {
    padding-inline: 20px;
    .app-form {
      display: flex;
      flex-wrap: wrap;

      &-item {
        width: 200px !important;
      }
    }
  }
</style>
