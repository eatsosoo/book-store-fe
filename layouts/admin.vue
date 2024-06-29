<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        class="bg-primary"
      >
        <v-list-item
          prepend-avatar="https://cdn.dribbble.com/userupload/6810642/file/original-45a54e0571ae13ce154f565f49615607.png?resize=400x0"
          title="BOOKIE"
          nav
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-chart-bar"
            title="Tổng quát"
            value="overview"
            @click="$router.push('/admin')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-order-bool-ascending"
            title="Đơn hàng"
            value="orders"
            @click="$router.push('/admin/orders')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-package-variant-closed"
            title="Sản phẩm"
            value="products"
            @click="$router.push('/admin/products')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-plus-box-multiple"
            title="Thêm sản phẩm"
            value="new_product"
            @click="$router.push('/admin/add')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-view-list"
            title="Danh mục"
            value="categories"
            @click="$router.push('/admin/categories')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-home-city"
            title="Về trang chủ"
            value="home"
            @click="$router.push('/')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="BgMain">
        <v-row>
          <v-col cols="12">
            <div class="Bar">
              <v-btn
                icon="mdi-logout"
                color="primary"
                class="ml-4"
                @click="dialog = true"
              ></v-btn>
            </div>
          </v-col>
        </v-row>
        <v-container>
          <div class="Wrapper">
            <slot />
          </div>
        </v-container>
      </v-main>
    </v-layout>

    <Confirm
      :active="dialog"
      text="Bạn đang thực hiện đăng xuất?"
      @accepted="logout"
      @rejected="dialog = false"
    ></Confirm>
  </v-card>
</template>
<script setup>
import { ref } from "vue";

const drawer = ref(true);
const rail = ref(true);
const dialog = ref(false);
</script>

<style lang="scss" scoped>
.Link {
  text-decoration: none;
  color: inherit;

  i {
    color: #a287d7;
  }
}
.IconBar {
  font-size: 20px;
  padding: 20px;
  border: 1px solid #a287d7;
  border-radius: 50%;
  color: #fff;
  background-color: #a287d7;
  cursor: pointer;
}
.Bar {
  border-bottom: 1px solid #e4e4e4;
  height: 57px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 20px;
  background: white;
}
.BgMain {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.Wrapper {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
