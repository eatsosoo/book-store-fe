<template>
  <div class="CategoryPage">
    <h1 class="text-capitalize">tác giả</h1>

    <div>
      <v-btn color="primary" class="mt-2" @click="dialog = true"
        >Thêm tác giả</v-btn
      >
    </div>

    <div class="pa-5 bg-white rounded-lg mt-5 BoxShadow">
      <v-card class="mx-auto">
        <v-card-text>
          <v-row>
            <v-col cols="3" class="mt-3 MarginFieldSearch"
              >Tên tác giả</v-col
            >
            <v-col cols="4"
              ><v-text-field
                v-model="searchForm.authorName"
                :loading="pageState.loading"
                density="compact"
                variant="outlined"
                hide-details
                single-line
                color="primary"
              ></v-text-field
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
      <v-data-table-server
        v-model:items-per-page="pageState.itemsPerPage"
        :headers="DEFAULT_HEADERS"
        :items="pageState.items"
        :items-length="pageState.totalItems"
        :loading="pageState.loading"
        items-per-page-text="Danh mục mỗi trang"
        no-data-text="Không có danh mục nào"
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
        <template #item.actions="{ item }">
          <v-icon
            class="mr-2"
            color="primary"
            @click="(dialog = true), (pageState.editId = `${item.id}`)"
            >mdi-pencil</v-icon
          >
          <!-- <v-icon v-if="authLimited(CATEGORY_DELETE)" color="primary" @click="(deleteDialog = true), (pageState.deleteId = `${item.id}`)">mdi-delete</v-icon> -->
        </template>
      </v-data-table-server>
    </div>

    <AuthorDialog
      :active="dialog"
      :author-id="pageState.editId"
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

<script setup lang="ts">
import { useApi } from "@/composable/useApiFetch";
import AuthorDialog from "~/components/organisms/AuthorDialog.vue";

definePageMeta({
  layout: "admin",
});

const DEFAULT_HEADERS = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Tên tác giả", key: "name", align: "start" },
  { title: "Quốc tịch", key: "nationality", align: "start" },
  { title: "Ngày sinh", key: "dob", align: "start" },
  { title: "Bút danh", key: "pseudonym", align: "start" },
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
  deleteId: "",
  editId: "",
  sort: DEFAULT_SORT,
});
const searchForm = reactive({
  authorName: "",
});
const dialog = ref(false);
const deleteDialog = ref(false);

const pageText = computed(() => {
  return `Trang ${pageState.page} / ${pageState.totalPages}`;
});

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
  } else {
    sorting += "&sort=" + JSON.stringify(DEFAULT_SORT[0]);
  }

  const params = `name=${encodeURIComponent(searchForm.authorName)}`;
  const { data: responseData } = await api(`/authors?${params}&` + paging + sorting);

  if (!responseData) {
    pageState.items = [];
  }

  if (responseData.value) {
    const { authors, pagination } = responseData.value.data;
    pageState.items = authors;
    pageState.totalItems = pagination.total;
    pageState.totalPages = pagination.total_pages;
  }

  pageState.loading = false;
};

const deleteItem = async (id) => {
  if (!id) return;

  const { api } = useApi(undefined, "DELETE", null, undefined);
  const { error } = await api(`/categories/${id}`);

  if (error.value) {
    toastError("Có lỗi xảy ra. Vui lòng thử lại sau.");
  } else {
    toastSuccess("Xoá tác giả thành công!");
    loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
  }

  deleteDialog.value = false;
};

const resetSearchForm = () => {
  searchForm.authorName = "";
  loadItems({ page: 1, itemsPerPage: 10, sortBy: DEFAULT_SORT });
};
</script>
