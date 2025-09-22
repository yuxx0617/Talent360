<template>
  <q-input
    class="mainInput"
    :filled="filled"
    :label="label"
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <template #prepend>
      <FontAwesomeIcon :icon="icon" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

interface Input {
  modelValue: string;
  label: string;
  filled?: boolean;
  icon: string;
}

defineProps<Input>();
</script>

<style scoped>
.mainInput {
  margin: 5px;
}
</style>
