<template>
  <div class="supervisor-setting">
    <!-- 標題與按鈕區 -->
    <div class="header-section">
      <h1 class="page-title">Supervisor Setting</h1>
      <div class="action-buttons">
        <mainBtn label="create new supervisor" color="primary" filled @click="onCreateNew" />
        <mainBtn label="export supervisor info" color="primary" outline @click="onExport" />
      </div>
    </div>

    <!-- 主管表格 -->
    <q-table
      :rows="supervisors"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :rows-per-page-options="[5, 10, 20]"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <!-- 序號欄位 -->
      <template #body-cell-index="props">
        <q-td :props="props">
          {{ (pagination.page - 1) * pagination.rowsPerPage + props.rowIndex + 1 }}
        </q-td>
      </template>

      <!-- 主管下拉選單 -->
      <template #body-cell-supervisor="props">
        <q-td :props="props">
          <mainSelect
            :model-value="getSupervisorValue(props.row.id)"
            :options="employeeOptions"
            dense
            outlined
            @update:model-value="(val) => onSupervisorChange(props.row.id, val)"
          />
        </q-td>
      </template>

      <!-- 操作按鈕 -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <div class="action-cell">
            <mainBtn
              label="save"
              color="primary"
              dense
              outline
              :disabled="!hasSupervisorChanged(props.row.id)"
              @click="onSave(props.row)"
            />
            <q-toggle
              :model-value="getActiveValue(props.row.id)"
              color="primary"
              @update:model-value="(val) => onActiveChange(props.row.id, val)"
            />
          </div>
        </q-td>
      </template>
    </q-table>

    <mainLoading v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import mainBtn from '../components/common/mainBtn.vue';
import mainSelect from '../components/common/mainSelect.vue';
import mainLoading from '../components/common/mainLoading.vue';
import { useSupervisorApi } from '../services/supervisorApi';
import type { Supervisor } from '../models/supervisorModel';

// ===== 測試模式開關（改成 false 連接真實 API）=====
const USE_MOCK_DATA = true;

// 假資料
const mockSupervisors: Supervisor[] = [
  { id: 1, division: 'ODDV', department: '', team: '', role: 'Director', supervisorId: '', supervisorName: '', isActive: true },
  { id: 2, division: 'ODDV', department: 'ODTW', team: '', role: 'DM', supervisorId: '', supervisorName: '', isActive: true },
  { id: 3, division: 'ODDV', department: 'ODSG', team: '', role: 'DM', supervisorId: '', supervisorName: '', isActive: true },
  { id: 4, division: 'ODDV', department: 'ODTW', team: 'HR-TW', role: 'teamLeader', supervisorId: '', supervisorName: '', isActive: true },
  { id: 5, division: 'ODDV', department: 'ODTW', team: 'Admin-TW', role: 'teamLeader', supervisorId: '', supervisorName: '', isActive: true },
  { id: 6, division: 'ODDV', department: 'ODSG', team: 'HR-SG', role: 'teamLeader', supervisorId: '', supervisorName: '', isActive: false },
  { id: 7, division: 'ODDV', department: 'ODSG', team: 'Admin-SG', role: 'teamLeader', supervisorId: '', supervisorName: '', isActive: true },
  { id: 8, division: 'ITDV', department: '', team: '', role: 'Director', supervisorId: '', supervisorName: '', isActive: true },
];

const { isLoading, getEmployeeOptions } = useSupervisorApi();

// 表格欄位定義
const columns = [
  { name: 'index', label: '#', field: 'index', align: 'center' as const },
  { name: 'division', label: 'Division', field: 'division', align: 'center' as const },
  { name: 'department', label: 'Department', field: 'department', align: 'center' as const },
  { name: 'team', label: 'Team', field: 'team', align: 'center' as const },
  { name: 'role', label: 'Role', field: 'role', align: 'center' as const },
  { name: 'supervisor', label: 'Supervisor', field: 'supervisor', align: 'center' as const },
  { name: 'action', label: 'Action', field: 'action', align: 'center' as const },
];

// 主管資料
const supervisors = ref<Supervisor[]>([]);
const totalRows = ref(0);

// 分頁設定
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});

// 員工選項
const employeeOptions = getEmployeeOptions();

// 追蹤變更
const supervisorChanges = reactive<Record<number, string>>({});
const activeChanges = reactive<Record<number, boolean>>({});

// 取得當前主管值
const getSupervisorValue = (id: number): string => {
  if (supervisorChanges[id] !== undefined) {
    return supervisorChanges[id];
  }
  const supervisor = supervisors.value.find((s) => s.id === id);
  return supervisor?.supervisorId || '';
};

// 取得當前啟用狀態
const getActiveValue = (id: number): boolean => {
  if (activeChanges[id] !== undefined) {
    return activeChanges[id];
  }
  const supervisor = supervisors.value.find((s) => s.id === id);
  return supervisor?.isActive ?? true;
};

// 主管變更
const onSupervisorChange = (id: number, value: string) => {
  supervisorChanges[id] = value;
};

// 啟用狀態變更
const onActiveChange = (id: number, value: boolean) => {
  activeChanges[id] = value;
  // 直接更新本地資料
  if (USE_MOCK_DATA) {
    const target = mockSupervisors.find((s) => s.id === id);
    if (target) {
      target.isActive = value;
    }
  }
};

// 檢查是否有變更
const hasSupervisorChanged = (id: number): boolean => {
  const supervisor = supervisors.value.find((s) => s.id === id);
  if (!supervisor) return false;
  const currentValue = supervisorChanges[id];
  return currentValue !== undefined && currentValue !== supervisor.supervisorId;
};

// 載入主管資料
const loadSupervisors = (page: number = 1, pageSize: number = 5) => {
  if (USE_MOCK_DATA) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    supervisors.value = mockSupervisors.slice(start, end);
    totalRows.value = mockSupervisors.length;
    pagination.value.rowsNumber = mockSupervisors.length;
  }
};

// 分頁請求
const onRequest = (requestProps: { pagination: { page: number; rowsPerPage: number } }) => {
  const { page, rowsPerPage } = requestProps.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  loadSupervisors(page, rowsPerPage);
};

// 儲存
const onSave = (supervisor: Supervisor) => {
  if (USE_MOCK_DATA) {
    const newSupervisorId = supervisorChanges[supervisor.id];
    if (newSupervisorId !== undefined) {
      const target = mockSupervisors.find((s) => s.id === supervisor.id);
      if (target) {
        target.supervisorId = newSupervisorId;
        const option = employeeOptions.find((o) => o.value === newSupervisorId);
        target.supervisorName = option?.label || '';
      }
      delete supervisorChanges[supervisor.id];
      alert('Mock: Saved successfully');
    }
  }
};

// 新增主管
const onCreateNew = () => {
  if (USE_MOCK_DATA) {
    alert('Mock: Create new supervisor clicked');
  }
};

// 匯出
const onExport = () => {
  if (USE_MOCK_DATA) {
    alert('Mock: Export supervisor info clicked');
  }
};

// 初始化載入
onMounted(() => {
  loadSupervisors();
});
</script>

<style scoped>
.supervisor-setting {
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

.action-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
