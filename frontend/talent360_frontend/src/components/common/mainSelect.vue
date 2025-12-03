<template>
  <q-select
    :model-value="modelValue"
    :options="options"
    :label="label"
    :dense="dense"
    :outlined="outlined"
    emit-value
    map-options
    class="main-select"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  modelValue: string;
  options: SelectOption[];
  label?: string;
  dense?: boolean;
  outlined?: boolean;
}

defineProps<Props>();
defineEmits(['update:modelValue']);
</script>

<style scoped>
.main-select {
  min-width: 150px;
}
</style>
