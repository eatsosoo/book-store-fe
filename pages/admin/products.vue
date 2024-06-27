<template>
  <div class="AdminProducts">
    <h1 class="text-capitalize">sản phẩm</h1>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-card class="mx-auto">
        <v-card-text>
          <v-row>
            <v-col cols="3" class="mt-3 MarginFieldSearch">Tên sách</v-col>
            <v-col cols="4"
              ><v-text-field
                v-model="searchForm.bookName"
                :loading="pageState.loading"
                density="compact"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="mt-3 MarginFieldSearch"
              >Tên tác giả</v-col
            >
            <v-col cols="4"
              ><v-text-field
                v-model="searchForm.author"
                :loading="pageState.loading"
                density="compact"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field
            ></v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="mt-3 MarginFieldSearch">Danh mục</v-col>
            <v-col cols="4"
              ><v-select
                v-model="searchForm.categoryId"
                :loading="pageState.loading"
                :items="pageState.categories"
                item-title="name"
                item-value="id"
                density="compact"
                variant="outlined"
                hide-details
                single-line
              ></v-select
            ></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="mt-2 mb-1">
            <v-col cols="3"></v-col>
            <v-col cols="4">
              <v-btn
                :loading="pageState.loading"
                variant="outlined"
                color="primary"
                class="mx-2"
                @click="resetSearchForm"
                >Làm mới</v-btn
              >
              <v-btn
                :loading="pageState.loading"
                variant="elevated"
                color="primary"
                class="mx-2"
                @click="
                  loadItems({
                    page: pageState.page,
                    itemsPerPage: pageState.itemsPerPage,
                    sortBy: pageState.sort,
                  })
                "
                >Tìm kiếm</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-card>
        <v-data-table-server
          v-model:items-per-page="pageState.itemsPerPage"
          :headers="DEFAULT_HEADERS"
          :items="pageState.items"
          :items-length="pageState.totalItems"
          :loading="pageState.loading"
          items-per-page-text="Sản phẩm mỗi trang"
          no-data-text="Không có sản phẩm nào"
          item-value="name"
          :fixed-header="true"
          :items-per-page-options="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'Tất cả' },
          ]"
          :page-text="pageText"
          class="DataTableHeight"
          @update:options="loadItems"
          @update:page="pageState.page = $event"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>
          <template #item.price="{ item }">{{ formatCurrency(item.price) }} đ</template>
          <template #item.actions="{ item }">
            <v-icon
              class="mr-2 mt-1"
              color="primary"
              @click="(editDialog = true), (pageState.editId = `${item.id}`)"
              >mdi-pencil</v-icon
            >
            <v-icon
              v-if="authLimited(PRODUCT_DELETE)"
              class="mr-2 mt-1"
              color="primary"
              @click="(dialog = true), (pageState.deleteItem = item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table-server>
      </v-card>
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
      @submit="
        (editDialog = false),
          loadItems({ page: 1, itemsPerPage: 10, sortBy: pageState.sort })
      "
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
  page: 1,
  totalPages: 1,
  loading: true,
  totalItems: 0,
  items: [],
  deleteItem: null,
  editId: "",
  sort: DEFAULT_SORT,
  categories: [],
});
const searchForm = reactive({
  bookName: "",
  author: "",
  categoryId: "",
});
const dialog = ref(false);
const editDialog = ref(false);

const pageText = computed(() => {
  return `Trang ${pageState.page} / ${pageState.totalPages}`
});

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
    paging = "&pagination=" + JSON.stringify({ page, per_page: itemsPerPage });
  }

  if (sortBy && sortBy.length) {
    sorting += "&sort=" + JSON.stringify(sortBy[0]);
  } else {
    sorting += "&sort=" + JSON.stringify(DEFAULT_SORT[0]);
  }

  const params = `name=${searchForm.bookName}&author=${searchForm.author}&category_id=${searchForm.categoryId}`;

  const { data: responseData } = await api(`/books?${params}` + paging + sorting);

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { books, pagination } = responseData.value.data;
    pageState.items = books;
    pageState.totalItems = pagination.total;
    pageState.totalPages = pagination.total_pages;
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

const loadCategories = async () => {
  const { api } = useApi(undefined, "GET", null, undefined);

  const { data: responseData } = await api("/categories");

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { categories } = responseData.value.data;
    pageState.categories = categories;
  }

  pageState.loading = false;
};

const resetSearchForm = () => {
  searchForm.bookName = "";
  searchForm.author = "";
  searchForm.categoryId = "";

  loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
};

loadCategories();
</script>

<style scoped>
.DataTableHeight {
  max-height: 650px;
}
</style>
