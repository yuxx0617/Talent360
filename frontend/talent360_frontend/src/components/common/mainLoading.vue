<template>
  <div v-if="modelValue" class="loading-overlay">
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="primary"
      class="q-ma-md"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 9999;

  background-color: rgba(255, 255, 255, 0.8);

  display: flex;
  justify-content: center;
  align-items: center;

  pointer-events: none;
}
</style>
