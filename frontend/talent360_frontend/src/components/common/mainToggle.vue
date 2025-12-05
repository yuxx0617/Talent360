<template>
  <q-toggle
    :model-value="modelValue"
    :label="label"
    :color="color"
    :disable="disabled"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
  color?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  color: 'primary',
  disabled: false,
});

defineEmits(['update:modelValue']);
</script>
