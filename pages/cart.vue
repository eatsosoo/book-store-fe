<template>
  <div class="CartPage">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex align-center">
          <h1 class="flex-shrink-0 mr-5">Giỏ hàng</h1>
          <hr class="w-100" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <div class="BookDetailCard">
            <v-tabs
              v-model="tab"
              align-tabs="start"
              color="deep-purple-accent-4"
            >
              <v-tab :value="1">Giỏ hàng</v-tab>
              <v-tab :value="2">Đơn hàng</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
              <v-tabs-window-item :value="1">
                <div class="TabItem">
                  <CartSteps @success="tab = 2"></CartSteps>
                </div>
              </v-tabs-window-item>
              <v-tabs-window-item :value="2">
                <div class="TabItem">
                  <MyOrders></MyOrders>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "client",
});

const tab = ref(null);
</script>

<style scoped>
.BookDetailCard {
  background-color: #fff;
  padding: 0 20px 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 50px 0;
  width: 1000px;
}

.TabItem {
  background-color: #fff;
  padding: 20px 5px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
