import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/loginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/announcement',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/announcementPage.vue') }],
  },
  {
    path: '/profile',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/profilePage.vue') }],
  },
  {
    path: '/eventList',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/eventListPage.vue') }],
  },
  // claudeCode
  {
    path: '/employeeSetting',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/employeeSettingPage.vue') }],
  },
  {
    path: '/organization',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/organizationPage.vue') }],
  },
  {
    path: '/supervisorSetting',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('src/pages/supervisorSettingPage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
