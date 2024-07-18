<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card :text="`${props.text}`" title="Xác nhận" class="pb-2 pr-3">
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="$emit('rejected'), dialog = false" color="primary" :variant="variant1">
          Huỷ
        </v-btn>

        <v-btn @click="$emit('accepted'), dialog = false" color="primary" :variant="variant2">
          OK
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    default: "Bạn có chắc chắn muốn thực hiện hành động này không?",
  },
  negative: {
    type: Boolean,
    default: false,
  }
});

const dialog = ref(false);
const variant1 = props.negative ? "outlined" : "elevated";
const variant2 = props.negative ? "elevated" : "outlined";

watch(
  () => props.active,
  (value) => {
    dialog.value = value;
  }
);
</script>
