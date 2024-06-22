<template>
  <div class="d-flex align-center">
    <v-icon size="15" color="grey">mdi-star</v-icon>
    <h4 class="mr-4">{{ props.star }}</h4>
    <v-progress-linear
      bg-color="white"
      :color="props.color"
      rounded
      height="8"
      :model-value="props.value"
    ></v-progress-linear>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: Number,
  star: String,
  color: String,
});
</script>
