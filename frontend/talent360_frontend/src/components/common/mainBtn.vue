<template>
  <q-btn
    class="mainBtn text-black"
    :label="label"
    :filled="filled"
    :flat="flat"
    :outline="outline"
    :color="color"
    :disable="disabled"
    @click="$emit('click')"
  >
    <template v-if="icon">
      <FontAwesomeIcon :icon="icon" />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

interface Button {
  label: string;
  icon?: string;
  filled?: boolean;
  flat?: boolean;
  outline?: boolean;
  color?: string;
  disabled?: boolean;
}
defineProps<Button>();

defineEmits(['click']);
</script>

<style scoped>
.mainBtn {
  margin: 5px;
  padding: 10px;
  text-transform: none !important;
}
</style>
