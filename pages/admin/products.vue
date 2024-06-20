<template>
  <div class="AdminProducts">
    <h1 class="text-capitalize">sản phẩm</h1>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-data-table-server
        v-model:items-per-page="pageState.itemsPerPage"
        :headers="DEFAULT_HEADERS"
        :items="pageState.items"
        :items-length="pageState.totalItems"
        :loading="pageState.loading"
        items-per-page-text="Sản phẩm mỗi trang"
        no-data-text="Không có sản phẩm nào"
        item-value="name"
        class="DataTableHeight"
        @update:options="loadItems"
      >
        <template #item.actions="{ item }">
          <v-icon
            class="mr-2"
            color="primary"
            @click="(editDialog = true), (pageState.editId = `${item.id}`)"
            >mdi-pencil</v-icon
          >
          <v-icon
            color="primary"
            @click="(dialog = true), (pageState.deleteItem = item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table-server>
    </div>

    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card :text="questionDelete" title="Xác nhận">
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false" color="primary" variant="elevated">
            Huỷ
          </v-btn>

          <v-btn
            @click="deleteItem(pageState.deleteItem.id)"
            color="primary"
            variant="outlined"
          >
            OK
          </v-btn>
        </template>
      </v-card>
    </v-dialog>

    <EditProductDialog
      :bookId="pageState.editId"
      :active="editDialog"
      @close="editDialog = false"
      @submit="(editDialog = false), loadItems({ page: 1, itemsPerPage: 10, sortBy: pageState.sort })"
    ></EditProductDialog>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useApi } from "@/composable/useApiFetch";

definePageMeta({
  layout: "admin",
});

const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Tên sách", key: "name", align: "start" },
  { title: "Tác giá", key: "author", align: "start" },
  { title: "Danh mục", key: "category_name", align: "start" },
  { title: "Giá (VNĐ)", key: "price", align: "center" },
  { title: "Sản phẩm còn (Quyển)", key: "stock", align: "center" },
  { title: "", key: "actions", align: "center", sortable: false },
];
const DEFAULT_SORT = [{ key: "id", order: "desc" }];
const pageState = reactive({
  itemsPerPage: 10,
  loading: true,
  totalItems: 0,
  items: [],
  deleteItem: null,
  editId: "",
  sort: DEFAULT_SORT,
});
const dialog = ref(false);
const editDialog = ref(false);

const questionDelete = computed(() => {
  if (pageState.deleteItem) {
    return `Bạn có chắc chắn muốn xoá cuốn sách: ${pageState.deleteItem.name}?`;
  }
  return "Bạn có chắc chắn muốn xoá sản phảm này?";
});

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  pageState.loading = true;
  pageState.sort = sortBy;

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
    loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
  }

  dialog.value = false;
};
</script>

<style scoped>
.DataTableHeight {
  max-height: 650px;
}
</style>
