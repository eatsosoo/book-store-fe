<template>
  <div class="CategoryPage">
    <h1 class="text-capitalize">danh mục</h1>

    <div>
      <v-btn color="primary" class="mt-2" @click="dialog = true"
        >Thêm danh mục</v-btn
      >
    </div>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-data-table-server
        v-model:items-per-page="pageState.itemsPerPage"
        :headers="DEFAULT_HEADERS"
        :items="pageState.items"
        :items-length="pageState.totalItems"
        :loading="pageState.loading"
        items-per-page-text="Sản phẩm mỗi trang"
        no-data-text="Không có danh mục nào"
        item-value="name"
        class="DataTableHeight"
        @update:options="loadItems"
      >
        <template #item.actions="{ item }">
          <v-icon
            class="mr-2"
            color="primary"
            @click="(dialog = true), (pageState.editId = `${item.id}`)"
            >mdi-pencil</v-icon
          >
          <v-icon color="primary" @click="(deleteDialog = true), (pageState.deleteId = `${item.id}`)">mdi-delete</v-icon>
        </template>
      </v-data-table-server>
    </div>

    <CategoryDialog
      :active="dialog"
      :category-id="pageState.editId"
      @close="dialog = false, pageState.editId = ''"
      @submit="
          loadItems({ page: 1, itemsPerPage: 10, sortBy: pageState.sort })
      "
    />

    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card text="Bạn chắc chắn muốn xoá danh mục này?" title="Xác nhận">
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="deleteDialog = false" color="primary" variant="elevated">
            Huỷ
          </v-btn>

          <v-btn
            @click="deleteItem(pageState.deleteId)"
            color="primary"
            variant="outlined"
          >
            OK
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useApi } from "@/composable/useApiFetch";
import CategoryDialog from "~/components/organisms/CategoryDialog.vue";

definePageMeta({
  layout: "admin",
});

const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Tên danh mục", key: "name", align: "start" },
  { title: "", key: "actions", align: "center", sortable: false },
];
const DEFAULT_SORT = [{ key: "id", order: "desc" }];

const pageState = reactive({
  itemsPerPage: 10,
  loading: true,
  totalItems: 0,
  items: [],
  deleteId: "",
  editId: "",
  sort: DEFAULT_SORT,
});
const dialog = ref(false);
const deleteDialog = ref(false);

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
  }

  pageState.loading = false;
};

const deleteItem = async (id) => {
  if (!id) return;

  const { api } = useApi(undefined, "DELETE", null, undefined);
  const { data: responseData, error } = await api(`/categories/${id}`);

  if (error.value) {
    toastError("Có lỗi xảy ra. Vui lòng thử lại sau.");
  } else {
    toastSuccess("Xoá danh mục thành công!");
    loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
  }

  deleteDialog.value = false;
};
</script>
