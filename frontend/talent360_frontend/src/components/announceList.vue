<template>
  <q-list class="announceList">
    <template v-for="(announce, index) in announcements" :key="announce.id">
      <q-item>
        <q-item-section class="announceList-section col-10" style="align-items: start">
          <q-item-label overline>{{ announce.type }}</q-item-label>
          <q-item-label>{{ announce.title }}</q-item-label>
          <q-item-label caption>{{ truncateContent(announce.content) }}</q-item-label>
        </q-item-section>

        <q-item-section class="announceList-section col-2" style="align-items: end">
          <q-item-label caption>{{
            formatDate(announce.updateTime, 'ddd MMM DD YYYY HH:mm:ss')
          }}</q-item-label>
          <button class="star-btn" @click="isStar(announce)">
            <FontAwesomeIcon
              :icon="announce.isStar ? 'fa-solid fa-star' : 'fa-regular fa-star'"
              class="star"
            />
          </button>
        </q-item-section>
      </q-item>

      <q-separator v-if="index < announcements.length - 1" class="announceList-line" />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import type { AnnounceList } from 'src/models/models';
import { date } from 'quasar';

library.add(fas, far);

const formatDate = date.formatDate;

defineProps({
  announcements: {
    type: Array as () => AnnounceList[],
    required: true,
  },
});

const isStar = (announce: AnnounceList) => {
  announce.isStar = !announce.isStar;
};
const truncateContent = (content: string, maxLength: number = 60) => {
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + '...';
  }
  return content;
};
</script>

<style scoped>
.announceList {
  border: 2px solid #2f3b77;
  border-radius: 5px;
  padding: 5px;
  margin: 10px 0px;
  width: 100%;
}
.announceList-section {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.announceList-line {
  height: 1px;
  background-color: #2f3b77;
}
.star-btn {
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  color: #888;
}
.star-btn:hover,
.star-btn:active,
.star-btn:focus {
  background: none;
  border: none;
  box-shadow: none;
}
.star {
  color: #2f3b77;
}
</style>
