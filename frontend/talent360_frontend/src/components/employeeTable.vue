<template>
  <div class="employee-table">
    <q-table
      :rows="employees"
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

      <!-- 權限下拉選單 -->
      <template #body-cell-permission="props">
        <q-td :props="props">
          <mainSelect
            :model-value="getPermissionValue(props.row.id)"
            :options="permissionOptions"
            dense
            outlined
            @update:model-value="(val) => onPermissionChange(props.row.id, val)"
          />
        </q-td>
      </template>

      <!-- 操作按鈕 -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <mainBtn
            label="save"
            color="primary"
            dense
            outline
            :disabled="!hasPermissionChanged(props.row.id)"
            @click="onSave(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Employee, PermissionOption } from '../models/settingModel';
import mainBtn from './common/mainBtn.vue';
import mainSelect from './common/mainSelect.vue';

interface Props {
  employees: Employee[];
  permissionOptions: PermissionOption[];
  totalRows: number;
  loading?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'save', employee: Employee, newPermission: string): void;
  (e: 'pageChange', page: number, rowsPerPage: number): void;
}>();

// 表格欄位定義
const columns = [
  { name: 'index', label: '#', field: 'index', align: 'center' as const },
  { name: 'id', label: 'Id', field: 'id', align: 'center' as const },
  { name: 'name', label: 'Name', field: 'name', align: 'center' as const },
  { name: 'division', label: 'Division', field: 'division', align: 'center' as const },
  { name: 'department', label: 'Department', field: 'department', align: 'center' as const },
  { name: 'team', label: 'Team', field: 'team', align: 'center' as const },
  { name: 'permission', label: 'permission', field: 'permission', align: 'center' as const },
  { name: 'action', label: 'Action', field: 'action', align: 'center' as const },
];

// 分頁設定
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  rowsNumber: props.totalRows,
});

// 追蹤權限變更
const permissionChanges = reactive<Record<string, string>>({});

// 監聽 totalRows 變化
watch(
  () => props.totalRows,
  (newVal) => {
    pagination.value.rowsNumber = newVal;
  }
);

// 取得當前權限值（優先顯示已變更的值）
const getPermissionValue = (id: string): string => {
  if (permissionChanges[id] !== undefined) {
    return permissionChanges[id];
  }
  const employee = props.employees.find((e) => e.id === id);
  return employee?.permission || '';
};

// 權限變更處理
const onPermissionChange = (id: string, value: string) => {
  permissionChanges[id] = value;
};

// 檢查權限是否有變更
const hasPermissionChanged = (id: string): boolean => {
  const employee = props.employees.find((e) => e.id === id);
  if (!employee) return false;
  const currentValue = permissionChanges[id];
  return currentValue !== undefined && currentValue !== employee.permission;
};

// 儲存
const onSave = (employee: Employee) => {
  const newPermission = permissionChanges[employee.id];
  if (newPermission !== undefined) {
    emit('save', employee, newPermission);
    delete permissionChanges[employee.id];
  }
};

// 分頁請求
const onRequest = (requestProps: { pagination: { page: number; rowsPerPage: number } }) => {
  const { page, rowsPerPage } = requestProps.pagination;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  emit('pageChange', page, rowsPerPage);
};
</script>

<style scoped>
.employee-table {
  width: 100%;
}
</style>
