<template>
  <div class="CategoryPage">
    <h1 class="text-capitalize">categories</h1>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-data-table-server
        v-model:items-per-page="pageState.itemsPerPage"
        :headers="DEFAULT_HEADERS"
        :items="pageState.items"
        :items-length="pageState.totalItems"
        :loading="pageState.loading"
        item-value="name"
        class="DataTableHeight"
        @update:options="loadItems"
      >
        <template #item.actions="{ item }">
          <v-icon class="mr-2" color="primary">mdi-pencil</v-icon>
          <v-icon color="primary">mdi-delete</v-icon>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>

<script setup>
import { useApi } from "@/composable/useApiFetch";

definePageMeta({
  layout: "admin",
});

const pageState = reactive({
  itemsPerPage: 5,
  loading: true,
  totalItems: 0,
  items: [],
  deleteItem: null,
});

const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Category name", key: "name", align: "start" },
  { title: "", key: "actions", align: "center" },
];
const DEFAULT_SORT = [{ key: "id", order: "desc" }];

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  pageState.loading = true;

  const { api } = useApi(undefined, "GET", null, undefined);
  let paging = "";
  let sorting = "";

  if (page && itemsPerPage) {
    paging = "pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
  }

  if (sortBy && sortBy.length) {
    sorting += "&sort=" + JSON.stringify(sortBy[0]);
  }

  const { data: responseData } = await api("/categories?" + paging + sorting);

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { categories, pagination } = responseData.value.data;
    pageState.items = categories;
    pageState.totalItems = pagination.total;
    console.log(pageState.items);
  }

  pageState.loading = false;
};
</script>
