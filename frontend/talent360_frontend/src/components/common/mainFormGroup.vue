<template>
  <div class="form-group">
    <label class="form-label">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
}

defineProps<Props>();
</script>

<style scoped>
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  padding: 8px 16px;
  background-color: #e8eaf6;
  border-radius: 20px;
  font-size: 14px;
  color: #2f3b77;
  text-align: center;
}
</style>
