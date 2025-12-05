<template>
  <div class="list-card">
    <div class="list-card-content">
      <slot></slot>
    </div>
    <div v-if="$slots.action" class="list-card-action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.list-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 2px solid #2f3b77;
  border-radius: 25px;
  background-color: #fff;
}

.list-card-content {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.list-card-action {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
