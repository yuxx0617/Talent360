<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card :class="['main-dialog', dialogClass]" :style="{ minWidth, maxWidth }">
      <q-card-section class="dialog-header">
        <div class="text-h6">{{ title }}</div>
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-body">
        <slot></slot>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="dialog-actions">
        <slot name="actions"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title: string;
  minWidth?: string;
  maxWidth?: string;
  dialogClass?: string;
}

withDefaults(defineProps<Props>(), {
  minWidth: '450px',
  maxWidth: '550px',
  dialogClass: '',
});

defineEmits(['update:modelValue', 'close']);
</script>

<style scoped>
.main-dialog {
  border-radius: 8px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-actions {
  padding: 16px;
}
</style>
