<template>
  <q-page class="profile">
    <q-page-section class="profile-section">
      <h5 class="text-primary">
        <FontAwesomeIcon icon="fa-solid fa-address-card" style="margin-right: 2px" />profile
      </h5>
    </q-page-section>
    <q-page-section class="profile-section">
      <mainBtn label="Employee Number" color="secondary" disabled />
      <mainBtn label="TP0161" flat disabled />
    </q-page-section>
  </q-page>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import mainBtn from 'components/common/mainBtn.vue';

library.add(fas);
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.profile-section {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  margin-top: 30px;
}
</style>
