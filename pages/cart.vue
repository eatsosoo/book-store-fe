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
                <CartSteps></CartSteps>
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
</script>

<style scoped>
.BookDetailCard {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 50px 0;
  width: 1000px;
}
</style>