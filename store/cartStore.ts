import { defineStore } from "pinia";

interface CartItem {
  itemId: number;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image: string;
}

interface Discount {
  code: string;
  amount: number;
}

interface Shipping {
  cost: number;
  address: string;
  method: string;
  phone: string;
}

interface Cart {
  cartId: string;
  userId?: string;
  items: CartItem[];
  discounts?: Discount[];
  shipping?: Shipping;
  dateCreated: Date;
  dateUpdated: Date;
  status: "new" | "processing" | "paid" | "cancelled";
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: {
      cartId: "",
      userId: "",
      items: [],
      discounts: [],
      shipping: {
        cost: 0,
        address: "",
        method: "CASH_ON_DELIVERY",
        phone: "",
      },
      dateCreated: new Date(),
      dateUpdated: new Date(),
      status: "new",
    } as Cart,
  }),
  getters: {
    getCart: (state) => {
      return state.cart ? state.cart : null;
    },
  },
  actions: {
    addToCart(cart: CartItem) {
      this.cart.items.push(cart);
      localStorage.setItem("cart", JSON.stringify(this.cart.items));
    },
    
    setShipping(shipping: Shipping) {
      this.cart.shipping = shipping;
    },

    removeCartItem(itemId: number) {
      this.cart.items = this.cart.items.filter((item) => item.itemId !== itemId);
      localStorage.setItem("cart", JSON.stringify(this.cart.items));
    },

    hasExistBookInCart(itemId: number) {
      return this.cart.items.some((item) => item.itemId === itemId);
    },

    clearCart() {
      this.cart.items = [];
      localStorage.removeItem("cart");
    },
  },
});
