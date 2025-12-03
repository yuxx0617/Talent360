import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { authService } from '../services/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 路由守衛：檢查認證狀態
  Router.beforeEach((to, _from, next) => {
    const requiresAuth = to.meta.requiresAuth;
    const isAuthenticated = authService.isAuthenticated();

    if (requiresAuth && !isAuthenticated) {
      // 需要認證但未登入，重定向到登入頁
      next('/');
    } else if (to.path === '/' && isAuthenticated) {
      // 已登入用戶訪問登入頁，重定向到公告頁
      next('/announcement');
    } else {
      next();
    }
  });

  return Router;
});
