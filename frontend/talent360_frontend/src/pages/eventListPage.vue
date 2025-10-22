<template>
  <q-page class="eventList">
    <q-page-section class="eventList-section">
      <h5 class="text-primary">
        <FontAwesomeIcon icon="fa-solid fa-rectangle-list" style="margin-right: 2px" />eventList
      </h5>
    </q-page-section>
  </q-page>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
</script>

<style scoped>
.eventList {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.eventList-section {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  margin-top: 30px;
}
</style>
