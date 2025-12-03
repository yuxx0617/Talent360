<template>
  <div class="employee-setting">
    <!-- 標題與按鈕區 -->
    <div class="header-section">
      <h1 class="page-title">Employee Setting</h1>
      <div class="action-buttons">
        <mainBtn label="sync data" color="primary" filled @click="onSyncData" />
        <mainBtn label="export employee info" color="primary" outline @click="onExport" />
      </div>
    </div>

    <!-- Tab 切換 -->
    <q-tabs v-model="activeTab" class="employee-tabs" active-color="primary" indicator-color="primary" align="left">
      <q-tab name="current" label="Current employee" />
      <q-tab name="resigned" label="Resigned employee" />
    </q-tabs>

    <!-- Tab 內容 -->
    <q-tab-panels v-model="activeTab" animated>
      <!-- 在職員工 -->
      <q-tab-panel name="current">
        <employeeTable :employees="currentEmployees" :permission-options="permissionOptions"
          :total-rows="currentTotalRows" :loading="isLoading" @save="onSavePermission"
          @page-change="onCurrentPageChange" />
      </q-tab-panel>

      <!-- 離職員工 -->
      <q-tab-panel name="resigned">
        <employeeTable :employees="resignedEmployees" :permission-options="permissionOptions"
          :total-rows="resignedTotalRows" :loading="isLoading" @save="onSavePermission"
          @page-change="onResignedPageChange" />
      </q-tab-panel>
    </q-tab-panels>

    <mainLoading v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import mainBtn from '../components/common/mainBtn.vue';
import mainLoading from '../components/common/mainLoading.vue';
import employeeTable from '../components/employeeTable.vue';
import { useSettingApi } from '../services/settingApi';
import type { Employee } from '../models/settingModel';

// ===== 測試模式開關（改成 false 連接真實 API）=====
const USE_MOCK_DATA = true;

// 假資料
const mockCurrentEmployees: Employee[] = [
  { id: 'T0001', name: 'test1', division: 'ODDV', department: 'ODTW', team: 'HR-TW', permission: '' },
  { id: 'T0002', name: 'test2', division: 'ODDV', department: 'ODTW', team: 'HR-TW', permission: '' },
  { id: 'T0003', name: 'test3', division: 'ODDV', department: 'ODTW', team: 'Admin-TW', permission: '' },
  { id: 'T0004', name: 'test4', division: 'ODDV', department: 'ODSG', team: 'HR-SG', permission: '' },
  { id: 'T0005', name: 'test5', division: 'ODDV', department: 'ODSG', team: 'HR-SG', permission: '' },
  { id: 'T0006', name: 'test6', division: 'ODDV', department: 'ODTW', team: 'HR-TW', permission: '' },
  { id: 'T0007', name: 'test7', division: 'ODDV', department: 'ODTW', team: 'Admin-TW', permission: '' },
  { id: 'T0008', name: 'test8', division: 'ODDV', department: 'ODSG', team: 'HR-SG', permission: '' },
];

const mockResignedEmployees: Employee[] = [
  { id: 'T9001', name: 'resigned1', division: 'ODDV', department: 'ODTW', team: 'HR-TW', permission: '' },
  { id: 'T9002', name: 'resigned2', division: 'ODDV', department: 'ODSG', team: 'HR-SG', permission: '' },
];

const { isLoading, getPermissionOptions } = useSettingApi();

// Tab 狀態
const activeTab = ref('current');

// 員工資料
const currentEmployees = ref<Employee[]>([]);
const resignedEmployees = ref<Employee[]>([]);
const currentTotalRows = ref(0);
const resignedTotalRows = ref(0);

// 權限選項
const permissionOptions = getPermissionOptions();

// 載入在職員工
const loadCurrentEmployees = (page: number = 1, pageSize: number = 5) => {
  if (USE_MOCK_DATA) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    currentEmployees.value = mockCurrentEmployees.slice(start, end);
    currentTotalRows.value = mockCurrentEmployees.length;
  }
};

// 載入離職員工
const loadResignedEmployees = (page: number = 1, pageSize: number = 5) => {
  if (USE_MOCK_DATA) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    resignedEmployees.value = mockResignedEmployees.slice(start, end);
    resignedTotalRows.value = mockResignedEmployees.length;
  }
};

// 儲存權限
const onSavePermission = (employee: Employee, newPermission: string) => {
  if (USE_MOCK_DATA) {
    const target = mockCurrentEmployees.find((e) => e.id === employee.id);
    if (target) {
      target.permission = newPermission;
    }
  }
};

// 同步資料
const onSyncData = () => {
  if (USE_MOCK_DATA) {
    alert('Mock: Sync data clicked');
  }
};

// 匯出資料
const onExport = () => {
  if (USE_MOCK_DATA) {
    alert('Mock: Export clicked');
  }
};

// 分頁變更
const onCurrentPageChange = (page: number, rowsPerPage: number) => {
  loadCurrentEmployees(page, rowsPerPage);
};

const onResignedPageChange = (page: number, rowsPerPage: number) => {
  loadResignedEmployees(page, rowsPerPage);
};

// 初始化載入
onMounted(() => {
  loadCurrentEmployees();
  loadResignedEmployees();
});
</script>

<style scoped>
.employee-setting {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 500;
  color: #2f3b77;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.employee-tabs {
  margin-bottom: 20px;
}

:deep(.q-tab) {
  text-transform: none;
}

:deep(.q-tab--active) {
  background-color: #2f3b77;
  color: white;
  border-radius: 20px 20px 0 0;
}
</style>
