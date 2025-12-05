<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-secondary">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="isOpenDrawer" />
        <q-toolbar-title> Talent 360 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model:mini="collapsed" show-if-above bordered :width="250"
      ><menuList :menuData="menuData" :collapsed="collapsed"
    /></q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import menuList from 'components/menuList.vue';

const menuData = [
  {
    label: 'For Employee',
    link: '',
    icon: 'user-tie',
    children: [
      {
        label: 'Announcement',
        icon: 'bullhorn',
        link: '/announcement',
      },
      {
        label: 'Profile',
        icon: 'address-card',
        link: '/profile',
      },
      {
        label: 'Event List',
        icon: 'rectangle-list',
        link: '/eventList',
      },
    ],
  },
  {
    label: 'For HR',
    link: '',
    icon: 'gear',
    children: [
      {
        label: 'Employee Setting',
        icon: 'users-gear',
        link: '/employeeSetting',
      },
      {
        label: 'Organization',
        icon: 'sitemap',
        link: '/organization',
      },
      {
        label: 'Supervisor Setting',
        icon: 'user-shield',
        link: '/supervisorSetting',
      },
      {
        label: 'Management Event List',
        icon: 'calendar-check',
        link: '/managementEventList',
      },
      {
        label: 'Form Setting',
        icon: 'file-lines',
        link: '/formSetting',
      },
      {
        label: 'Form Type Setting',
        icon: 'sliders',
        link: '/formTypeSetting',
      },
    ],
  },
];

const collapsed = ref(false);

function isOpenDrawer() {
  collapsed.value = !collapsed.value;
}
</script>
