import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/loginPage.vue'),
  },
  {
    path: '/announcement',
    component: () => import('src/layouts/mainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/announcementPage.vue') }],
  },
  {
    path: '/profile',
    component: () => import('src/layouts/mainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/profilePage.vue') }],
  },
  {
    path: '/eventList',
    component: () => import('src/layouts/mainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/eventListPage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/errorNotFound.vue'),
  },
];

export default routes;
