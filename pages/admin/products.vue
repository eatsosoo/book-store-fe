<template>
  <div class="AdminProducts">
    <h1 class="text-capitalize">products</h1>

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
          <v-icon
            color="primary"
            @click="(dialog = true), (pageState.deleteItem = item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table-server>
    </div>

    <div class="text-center pa-4">
      <v-dialog v-model="dialog" max-width="400" persistent>
        <v-card :text="questionDelete" title="Confirmation">
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="dialog = false" color="primary" variant="elevated">
              Cancel
            </v-btn>

            <v-btn
              @click="deleteItem(pageState.deleteItem.id)"
              color="primary"
              variant="outlined"
            >
              Confirm
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
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
const dialog = ref(false);
const questionDelete = computed(() => {
  if (pageState.deleteItem) {
    return `Are you sure you want to delete ${pageState.deleteItem.name}?`;
  }
  return "Are you sure you want to delete this book?";
});
const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Book name", key: "name", align: "start" },
  { title: "Author", key: "user_name", align: "start" },
  { title: "Category", key: "category_name", align: "start"},
  { title: "Price ($)", key: "price", align: "center" },
  { title: "Stock", key: "stock", align: "center" },
  { title: "", key: "actions", align: "center" },
];
const DEFAULT_SORT = [{ key: "id", order: 'desc' }];

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    console.log(sortBy)
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
 
  const { data: responseData } = await api("/books?" + paging + sorting);

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { books, pagination } = responseData.value.data;
    pageState.items = books;
    pageState.totalItems = pagination.total;
  }

  pageState.loading = false;
};

const deleteItem = async (id) => {
  if (!id) return;

  const { api } = useApi(undefined, "DELETE", null, undefined);
  const { data: responseData } = await api(`/books/${id}`);

  if (responseData) {
    loadItems({ page: 1, itemsPerPage: 5, sortBy: DEFAULT_SORT });
  }

  dialog.value = false;
};

loadItems({ page: 1, itemsPerPage: 5, sortBy: DEFAULT_SORT });
</script>

<style scoped>
.DataTableHeight {
  max-height: 650px;
}
</style>
