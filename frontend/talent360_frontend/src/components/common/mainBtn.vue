<template>
  <q-btn class="mainBtn" :filled="filled" :label="label" :color="color" @click="$emit('click')">
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
  color: string;
  label: string;
  filled?: boolean;
  icon?: string;
}

defineProps<Button>();

defineEmits(['click']);
</script>

<style scoped>
.mainBtn {
  margin: 5px;
  padding: 10px;
}
</style>
