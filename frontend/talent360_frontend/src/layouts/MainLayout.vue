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
  // {
  //   label: 'For HR',
  //   icon: 'gear',
  //   children: [
  //     {
  //       label: 'API',
  //       icon: 'user-tie',
  //       link: 'https://quasar.dev/docs/api',
  //     },
  //     {
  //       label: 'Components',
  //       icon: 'user-tie',
  //       link: 'https://quasar.dev/components',
  //     },
  //   ],
  // },
];

const collapsed = ref(false);

function isOpenDrawer() {
  collapsed.value = !collapsed.value;
}
</script>
