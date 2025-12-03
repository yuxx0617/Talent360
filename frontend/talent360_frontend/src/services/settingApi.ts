import { useApi } from '../composables/useApi';
import type {
  EmployeeListResponse,
  EmployeeUpdateRequest,
  PermissionOption,
} from '../models/settingModel';

export function useSettingApi() {
  const { loading, get, post } = useApi<EmployeeListResponse>();

  // 取得在職員工列表
  const getCurrentEmployees = async (page: number = 1, pageSize: number = 5) => {
    return await get(`/Setting/CurrentEmployees?page=${page}&pageSize=${pageSize}`);
  };

  // 取得離職員工列表
  const getResignedEmployees = async (page: number = 1, pageSize: number = 5) => {
    return await get(`/Setting/ResignedEmployees?page=${page}&pageSize=${pageSize}`);
  };

  // 更新員工權限
  const updateEmployeePermission = async (data: EmployeeUpdateRequest) => {
    return await post('/Setting/UpdatePermission', data);
  };

  // 同步資料
  const syncData = async () => {
    return await post('/Setting/SyncData', {});
  };

  // 匯出員工資料
  const exportEmployeeInfo = async () => {
    return await get('/Setting/ExportEmployees');
  };

  // 取得權限選項
  const getPermissionOptions = (): PermissionOption[] => {
    return [
      { label: 'choose employee', value: '' },
      { label: 'HR-TW', value: 'HR-TW' },
      { label: 'HR-SG', value: 'HR-SG' },
      { label: 'Admin-TW', value: 'Admin-TW' },
      { label: 'Admin-SG', value: 'Admin-SG' },
    ];
  };

  return {
    isLoading: loading,
    getCurrentEmployees,
    getResignedEmployees,
    updateEmployeePermission,
    syncData,
    exportEmployeeInfo,
    getPermissionOptions,
  };
}
