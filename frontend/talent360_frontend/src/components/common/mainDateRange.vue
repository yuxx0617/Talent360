<template>
  <div class="date-range">
    <q-input
      :model-value="startDate"
      outlined
      dense
      type="date"
      @update:model-value="updateStart"
    />
    <span class="date-separator">~</span>
    <q-input
      :model-value="endDate"
      outlined
      dense
      type="date"
      @update:model-value="updateEnd"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  startDate: string;
  endDate: string;
}

defineProps<Props>();

const emit = defineEmits(['update:startDate', 'update:endDate']);

const updateStart = (value: string | number | null) => {
  emit('update:startDate', value);
};

const updateEnd = (value: string | number | null) => {
  emit('update:endDate', value);
};
</script>

<style scoped>
.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-separator {
  color: #666;
}
</style>
