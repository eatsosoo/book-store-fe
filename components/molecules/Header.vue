<template>
  <div class="BorderBottom bg-primary Header">
    <v-container>
      <div class="d-flex justify-space-between align-center mt-3 mb-3">
        <NuxtLink to="/" class="Link">
          <p class="text-h4">Bookie</p>
          <p>Website for books</p>
        </NuxtLink>
        <div class="Search">
          <v-text-field
            v-model="searchKey"
            :loading="loading"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Tìm kiếm sách"
            variant="solo"
            hide-details
            single-line
            rounded="pill"
            @keydown.enter="$router.push(`/book?name=${searchKey}`)"
          ></v-text-field>
        </div>
        <div v-if="!authStore.hasToken" class="d-flex">
          <div class="position-relative">
            <v-btn
              icon="mdi-cart"
              color="white"
              density="comfortable"
              @click="dialog2 = true"
            ></v-btn>
            <div class="position-absolute CartQuantity">{{ cartQuantity }}</div>
          </div>
          <v-btn
            color="white"
            rounded="pill"
            class="mr-4 ml-4"
            @click="$router.push('/login')"
            >Đăng nhập</v-btn
          >
          <v-btn color="white" rounded="pill" @click="$router.push('/register')"
            >Đăng ký</v-btn
          >
        </div>
        <div v-else class="d-flex">
          <div class="position-relative">
            <v-btn
              icon="mdi-cart"
              color="white"
              density="comfortable"
              @click="$router.push('/cart')"
            ></v-btn>
            <div class="position-absolute CartQuantity">{{ cartQuantity }}</div>
          </div>
          <div>
            <v-btn
              icon="mdi-logout"
              color="white"
              density="comfortable"
              class="ml-4"
              @click="dialog = true"
            ></v-btn>
          </div>
          <div>
            <v-btn
              icon="mdi-account"
              color="white"
              density="comfortable"
              class="ml-4"
            ></v-btn>
          </div>
        </div>
      </div>
    </v-container>

    <Confirm
      :active="dialog"
      text="Bạn đang thực hiện đăng xuất?"
      @accepted="logout"
      @rejected="dialog = false"
    ></Confirm>

    <Confirm
      :active="dialog2"
      text="Vui lòng đăng nhặp để tiếp tục!"
      :negative="true"
      @accepted="$router.push('/login')"
      @rejected="dialog2 = false"
    ></Confirm>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";
import { useCartStore } from "~/store/cartStore";

const authStore = useAuthStore();
const cartStore = useCartStore();
const loading = ref(false);
const dialog = ref(false);
const dialog2 = ref(false);
const cartQuantity = computed(() => cartStore.cart.items.length);
const searchKey = ref("");
</script>

<style lang="scss">
.Search {
  width: 500px;
}

.CartQuantity {
  right: -8px;
  top: -6px;
  background: red;
  width: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  color: white;
}

.Header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.BorderBottom {
  border-bottom: 1px solid #cecece;
}

.Link {
  text-decoration: none;
  color: inherit;

  i {
    color: #a287d7;
  }
}
</style>
