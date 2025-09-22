<template>
  <q-page class="announcement">
    <mainCarousel />

  </q-page>
</template>

<script setup lang="ts">
import mainCarousel from 'components/common/mainCarousel.vue';
</script>

<style scoped>
.announcement {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
