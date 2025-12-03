# Talent360 Frontend 專案結構說明

> **技術棧**: Vue 3 + TypeScript + Quasar + Vite

---

## 目錄結構

```
src/
├── assets/          # 靜態資源
├── boot/            # 應用初始化
├── components/      # Vue 組件
├── composables/     # 組合式函數
├── layouts/         # 頁面佈局
├── models/          # TypeScript 型別定義
├── pages/           # 頁面組件
├── router/          # 路由設定
├── services/        # API 服務層
└── App.vue          # 根組件
```

---

## 各資料夾詳細說明

### `assets/` - 靜態資源
存放圖片、字體、圖示等靜態檔案。

```
assets/
└── images/
    ├── carousel_1.jpg
    ├── carousel_2.jpg
    └── ...
```

---

### `boot/` - 應用初始化
Quasar 的 boot 檔案，在應用啟動時執行。用於初始化第三方套件。

```typescript
// boot/naive-ui.ts
import { Directives } from 'quasar';
// 初始化 Naive-UI 等套件
```

---

### `components/` - Vue 組件
可重複使用的 UI 組件。

```
components/
├── common/              # 通用組件
│   ├── mainBtn.vue      # 按鈕組件
│   ├── mainInput.vue    # 輸入框組件
│   ├── mainLoading.vue  # Loading 組件
│   └── mainCarousel.vue # 輪播組件
├── announceList.vue     # 公告列表
└── menuList.vue         # 選單列表
```

**使用方式**:
```vue
<script setup lang="ts">
import mainBtn from 'components/common/mainBtn.vue';
</script>

<template>
  <mainBtn label="送出" icon="fa-solid fa-check" @click="onSubmit" />
</template>
```

---

### `composables/` - 組合式函數
Vue 3 Composition API 的可重用邏輯。

```typescript
// composables/useApi.ts
export function useApi<T>() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const get = async (url: string) => { ... };
  const post = async (url: string, data: unknown) => { ... };

  return { loading, error, get, post };
}
```

**用途**: 封裝 API 請求的通用邏輯（loading 狀態、錯誤處理等）

---

### `layouts/` - 頁面佈局
定義頁面的整體框架結構。

```
layouts/
└── MainLayout.vue    # 主要佈局（含側邊選單）
```

**結構**:
```
┌─────────────────────────────────────┐
│            Header                   │
├──────────┬──────────────────────────┤
│          │                          │
│  選單    │      <router-view />     │
│          │       (頁面內容)          │
│          │                          │
└──────────┴──────────────────────────┘
```

---

### `models/` - TypeScript 型別定義
定義 API 請求/響應的資料結構。

```typescript
// models/employeeModel.ts
export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  token: string;
}
```

**命名規範**:
- `XxxRequest` - API 請求參數
- `XxxResponse` - API 響應資料

---

### `pages/` - 頁面組件
對應路由的頁面級組件。

```
pages/
├── loginPage.vue        # 登入頁
├── announcementPage.vue # 公告頁
├── profilePage.vue      # 個人資料頁
├── eventListPage.vue    # 活動列表頁
└── ErrorNotFound.vue    # 404 頁面
```

---

### `router/` - 路由設定

```
router/
├── index.ts    # Router 實例 + 路由守衛
└── routes.ts   # 路由定義
```

**路由守衛** (`index.ts`):
```typescript
Router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/');  // 未登入 → 重定向到登入頁
  } else {
    next();
  }
});
```

**路由定義** (`routes.ts`):
```typescript
{
  path: '/announcement',
  component: () => import('src/layouts/MainLayout.vue'),
  meta: { requiresAuth: true },  // 需要登入
  children: [
    { path: '', component: () => import('src/pages/announcementPage.vue') }
  ],
}
```

---

### `services/` - API 服務層
處理所有後端 API 請求。

```
services/
├── api.ts           # Axios 基礎設定 + 攔截器
├── auth.ts          # JWT 認證管理
└── employeeApi.ts   # 員工相關 API
```

#### `api.ts` - Axios 實例
```typescript
const api = axios.create({
  baseURL: 'https://localhost:7204/api',
  timeout: 5000,
});

// 請求攔截器：自動附加 JWT
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 響應攔截器：處理 401 錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.removeToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

#### `auth.ts` - JWT 管理
```typescript
export const authService = {
  getToken(): string | null { ... },
  setToken(token: string): void { ... },
  removeToken(): void { ... },
  isAuthenticated(): boolean { ... },
};
```

#### `employeeApi.ts` - 業務 API
```typescript
export function useEmployeeApi() {
  const { loading, post } = useApi();

  const employeeLogin = async (form: LoginRequest) => {
    return await post('/Employee/Login', form);
  };

  return { isLoading: loading, employeeLogin };
}
```

---

## 架構流程圖

```
┌─────────────────────────────────────────────────────────┐
│  頁面 (Pages)                                           │
│  src/pages/*.vue                                        │
│  - 畫面呈現、用戶互動                                    │
└──────────────────────┬──────────────────────────────────┘
                       │ 調用
                       ▼
┌─────────────────────────────────────────────────────────┐
│  API 服務層 (Services)                                  │
│  src/services/*Api.ts                                   │
│  - 封裝特定業務的 API 呼叫                               │
└──────────────────────┬──────────────────────────────────┘
                       │ 使用
                       ▼
┌─────────────────────────────────────────────────────────┐
│  共用 API 邏輯 (Composables)                            │
│  src/composables/useApi.ts                              │
│  - 處理 loading 狀態、統一錯誤處理                       │
└──────────────────────┬──────────────────────────────────┘
                       │ 使用
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Axios 實例 (API Client)                                │
│  src/services/api.ts                                    │
│  - 基礎配置、請求/響應攔截器                             │
└─────────────────────────────────────────────────────────┘
```

---

## 新增功能指南

### 新增頁面

1. **建立頁面組件**: `src/pages/NewPage.vue`
2. **新增路由**: `src/router/routes.ts`
3. **更新選單** (如需要): `src/layouts/MainLayout.vue`

### 新增 API

1. **定義型別**: `src/models/newModel.ts`
2. **建立 API 服務**: `src/services/newApi.ts`
3. **在頁面中使用**:
   ```typescript
   const { isLoading, fetchData } = useNewApi();
   ```

---

## 命名規範

| 類型 | 規範 | 範例 |
|------|------|------|
| 組件檔案 | PascalCase | `MainLayout.vue` |
| 頁面檔案 | camelCase + Page | `loginPage.vue` |
| TypeScript 檔案 | camelCase | `employeeApi.ts` |
| 介面名稱 | PascalCase | `LoginRequest` |
| 組合函數 | use + PascalCase | `useApi()` |

---

## 相關文件

- [Vue 3 官方文件](https://vuejs.org/)
- [Quasar Framework](https://quasar.dev/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Vue Router](https://router.vuejs.org/)
