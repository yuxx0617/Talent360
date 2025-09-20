<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-dark">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Talent 360 </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model:mini="collapsed" show-if-above bordered :width="200"
      ><TalentMenu :menuList="menuList" :collapsed="collapsed"
    /></q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TalentMenu from 'components/TalentMenu.vue';

const menuList = [
  {
    label: 'For Employee',
    link: '',
    icon: 'user-tie',
    children: [
      {
        label: 'API',
        icon: 'user-tie',
        link: 'https://quasar.dev/docs/api',
      },
      {
        label: 'Components',
        icon: 'user-tie',
        link: 'https://quasar.dev/components',
      },
    ],
  },
  {
    label: 'For HR',
    icon: 'gear',
    link: 'https://github.com/quasarframework',
  },
];

const collapsed = ref(false);

function toggleLeftDrawer() {
  collapsed.value = !collapsed.value;
}
</script>
