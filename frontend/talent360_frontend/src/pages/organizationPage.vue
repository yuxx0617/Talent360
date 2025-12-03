<template>
  <div class="organization-page">
    <!-- 標題與按鈕區 -->
    <div class="header-section">
      <h1 class="page-title">Organization</h1>
      <div class="action-buttons">
        <mainBtn label="sync data" color="primary" filled @click="onSyncData" />
        <mainBtn label="generate chart" color="primary" outline @click="onGenerateChart" />
      </div>
    </div>

    <!-- 組織表格 -->
    <q-table
      :rows="organizations"
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

      <!-- 操作按鈕 -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <mainBtn
            label="Detail"
            color="primary"
            dense
            outline
            @click="onDetail(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Detail Dialog -->
    <q-dialog v-model="showDetailDialog">
      <q-card class="detail-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">Organization Detail</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedOrg">
          <div class="detail-info">
            <p><strong>Division:</strong> {{ selectedOrg.division }}</p>
            <p><strong>Department:</strong> {{ selectedOrg.department || '-' }}</p>
            <p><strong>Team:</strong> {{ selectedOrg.team || '-' }}</p>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <mainBtn label="Close" color="primary" outline v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <mainLoading v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import mainBtn from '../components/common/mainBtn.vue';
import mainLoading from '../components/common/mainLoading.vue';
import { useOrganizationApi } from '../services/organizationApi';
import type { Organization } from '../models/organizationModel';

// ===== 測試模式開關（改成 false 連接真實 API）=====
const USE_MOCK_DATA = true;

// 假資料
const mockOrganizations: Organization[] = [
  { id: 1, division: 'ODDV', department: '', team: '' },
  { id: 2, division: 'ODDV', department: 'ODTW', team: '' },
  { id: 3, division: 'ODDV', department: 'ODSG', team: '' },
  { id: 4, division: 'ODDV', department: 'ODTW', team: 'HR-TW' },
  { id: 5, division: 'ODDV', department: 'ODTW', team: 'Admin-TW' },
  { id: 6, division: 'ODDV', department: 'ODSG', team: 'HR-SG' },
  { id: 7, division: 'ODDV', department: 'ODSG', team: 'Admin-SG' },
  { id: 8, division: 'ITDV', department: '', team: '' },
  { id: 9, division: 'ITDV', department: 'ITTW', team: '' },
  { id: 10, division: 'ITDV', department: 'ITTW', team: 'Dev-TW' },
];

const { isLoading } = useOrganizationApi();

// 表格欄位定義
const columns = [
  { name: 'index', label: '#', field: 'index', align: 'center' as const },
  { name: 'division', label: 'Division', field: 'division', align: 'center' as const },
  { name: 'department', label: 'Department', field: 'department', align: 'center' as const },
  { name: 'team', label: 'Team', field: 'team', align: 'center' as const },
  { name: 'action', label: 'Action', field: 'action', align: 'center' as const },
];

// 組織資料
const organizations = ref<Organization[]>([]);
const totalRows = ref(0);

// 分頁設定
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0,
});

// Dialog 狀態
const showDetailDialog = ref(false);
const selectedOrg = ref<Organization | null>(null);

// 載入組織資料
const loadOrganizations = (page: number = 1, pageSize: number = 5) => {
  if (USE_MOCK_DATA) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    organizations.value = mockOrganizations.slice(start, end);
    totalRows.value = mockOrganizations.length;
    pagination.value.rowsNumber = mockOrganizations.length;
  }
};

// 分頁請求
const onRequest = (requestProps: { pagination: { page: number; rowsPerPage: number } }) => {
  const { page, rowsPerPage } = requestProps.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  loadOrganizations(page, rowsPerPage);
};

// 查看詳情
const onDetail = (org: Organization) => {
  selectedOrg.value = org;
  showDetailDialog.value = true;
};

// 同步資料
const onSyncData = () => {
  if (USE_MOCK_DATA) {
    alert('Mock: Sync data clicked');
  }
};

// 產生組織圖
const onGenerateChart = () => {
  if (USE_MOCK_DATA) {
    alert('Mock: Generate chart clicked');
  }
};

// 初始化載入
onMounted(() => {
  loadOrganizations();
});
</script>

<style scoped>
.organization-page {
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

.detail-dialog {
  min-width: 400px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-info p {
  margin: 10px 0;
}
</style>
