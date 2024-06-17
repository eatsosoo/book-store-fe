<template>
  <div>
    <v-stepper v-model="step">
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <v-stepper-item
            title="Preview Order"
            value="1"
            :complete="step > '1'"
            color="primary"
          >
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Shipping"
            value="2"
            :complete="step > '2'"
            color="primary"
          >
          </v-stepper-item>

          <v-divider></v-divider>

          <v-stepper-item
            title="Confirm Order"
            value="3"
            :complete="step > '3'"
            color="primary"
          >
          </v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item value="1">
            <h3 class="text-h6">Order</h3>

            <br />

            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="text-end">Quantity</th>
                    <th class="text-end">Price</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(product, index) in products" :key="index">
                    <td v-text="product.name"></td>
                    <td class="text-end">
                      <div class="d-flex justify-end align-center">
                        <v-btn
                          color="primary"
                          density="compact"
                          icon="mdi-plus"
                          @click="plusQuantity(index)"
                        ></v-btn>
                        <div class="QuantityText">{{ product.quantity }}</div>
                        <v-btn
                          color="primary"
                          density="compact"
                          icon="mdi-minus"
                          @click="minusQuantity(index)"
                        ></v-btn>
                      </div>
                    </td>
                    <td
                      class="text-end"
                      v-text="product.quantity * product.price"
                    ></td>
                  </tr>

                  <tr>
                    <th>Total</th>
                    <th></th>
                    <th class="text-end">${{ subtotal }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-stepper-window-item>

          <v-stepper-window-item value="2">
            <h3 class="text-h6">Shipping</h3>
            <br />
            <v-radio-group
              v-model="shipping.cost"
              label="Delivery Method"
              color="primary"
            >
              <v-radio label="Standard Shipping" value="5"></v-radio>
              <v-radio label="Priority Shipping" value="10"></v-radio>
              <v-radio label="Express Shipping" value="15"></v-radio>
            </v-radio-group>
            <h3 class="text-h6">Address</h3>
            <br />
            <v-text-field
              v-model="shipping.address"
              density="compact"
              variant="outlined"
              hide-details
              single-line
              color="primary"
              class="mx-4"
            ></v-text-field>
            <br />
            <h3 class="text-h6">Phone</h3>
            <br />
            <v-text-field
              v-model="shipping.phone"
              density="compact"
              variant="outlined"
              hide-details
              single-line
              color="primary"
              class="mx-4"
            ></v-text-field>
            <br />
          </v-stepper-window-item>

          <v-stepper-window-item value="3">
            <h3 class="text-h6">Confirm</h3>
            <br />
            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="text-end">Quantity</th>
                    <th class="text-end">Price</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(product, index) in products" :key="index">
                    <td v-text="product.name"></td>
                    <td class="text-end" v-text="product.quantity"></td>
                    <td
                      class="text-end"
                      v-text="product.quantity * product.price"
                    ></td>
                  </tr>

                  <tr>
                    <td>Shipping</td>
                    <td></td>
                    <td class="text-end" v-text="shipping.cost"></td>
                  </tr>

                  <tr>
                    <th>Total</th>
                    <th></th>
                    <th class="text-end">${{ total }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions
          color="primary"
          :disabled="disabled"
          @click:next="next"
          @click:prev="prev"
        ></v-stepper-actions>
      </template>
    </v-stepper>

    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card text="Are you sure you want to delete this item from your cart?" title="Confirmation">
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="dialog = false" color="primary" variant="elevated">
            Cancel
          </v-btn>

          <v-btn
            @click="deleteItem(deleteId)"
            color="primary"
            variant="outlined"
          >
            Confirm
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/store/cartStore';

const cartStore = useCartStore();
const shipping = reactive({
  cost: "5",
  address: "",
  phone: "",
  method: "CASH_ON_DELIVERY",
});
const step = ref("0");
const dialog = ref(false);
const deleteId = ref<number | null>(null)

const subtotal = computed(() => {
  return products.value.reduce(
    (acc: number, product: { price: number; quantity: number }) => {
      return acc + product.price * product.quantity;
    },
    0
  );
});

const total = computed(() => {
  return Number(subtotal.value) + Number(shipping.cost);
});

const totalQuantity = computed(() => {
  return products.value.reduce(
    (acc: number, product: { quantity: number }) => {
      return acc + product.quantity;
    },
    0
  );
});

const products = computed(() => cartStore.cart.items);

const disabled = computed(() => {
  if (
    (step.value === "2" && !shipping.address) ||
    (step.value === "2" && !shipping.phone)
  ) {
    return "next";
  }
  
  if (step.value === "0" && totalQuantity.value === 0) {
    return "next";
  }

  return false;
});

const plusQuantity = (index: number) => {
  products.value[index].quantity++;
};

const minusQuantity = (index: number) => {
  if (products.value[index].quantity === 0) {
    deleteId.value = products.value[index].itemId;
    dialog.value = true;
  }

  if (products.value[index].quantity > 0) {
    products.value[index].quantity--;
  }
};

const deleteItem = (id: number | null) => {
  if (!id) return;
  cartStore.removeCartItem(id);
  dialog.value = false;
};
</script>

<style lang="scss" scoped>
.v-text-field {
  width: 300px;
}

.QuantityText {
  text-align: center;
  width: 50px;
}
</style>
