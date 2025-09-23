<template>
  <q-page class="announcement">
    <mainCarousel />
    <q-page-section class="announcement-section">
      <h5 class="text-primary">
        <FontAwesomeIcon icon="fa-solid fa-bullhorn" style="margin-right: 2px" />Bulletin Board
      </h5>
    </q-page-section>
    <announceList :announcements="announcementData" />
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import mainCarousel from 'components/common/mainCarousel.vue';
import announceList from 'src/components/announceList.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const announcementData = reactive([
  {
    id: 1,
    type: '活動',
    title: '中秋烤肉大會',
    content: '邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動邀請大家來參與中秋烤肉活動',
    updateTime: new Date(),
    isStar: false,
  },
  {
    id: 2,
    type: '公告',
    title: '網站維護通知',
    content: '本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護本週六凌晨將進行系統維護',
    updateTime: new Date(),
    isStar: true,
  },
]);
</script>

<style scoped>
.announcement {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.announcement-section {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  margin-top: 30px;
}
</style>
