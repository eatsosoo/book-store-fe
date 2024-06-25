<template>
  <div class="d-flex align-center">
    <v-text-field
      v-model="startDate"
      type="date"
      class="mr-2"
      readonly
      various="outlined"
      hide-details
    ></v-text-field>
    <v-icon density="">mdi-calendar</v-icon>
  </div>
</template>

<script setup lang="ts">
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
</script>
