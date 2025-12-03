import { useApi } from '../composables/useApi';
import type { SupervisorListResponse, SupervisorUpdateRequest, EmployeeOption } from '../models/supervisorModel';

export function useSupervisorApi() {
  const { loading, get, post } = useApi<SupervisorListResponse>();

  // 取得主管列表
  const getSupervisors = async (page: number = 1, pageSize: number = 5) => {
    return await get(`/Supervisor?page=${page}&pageSize=${pageSize}`);
  };

  // 更新主管設定
  const updateSupervisor = async (data: SupervisorUpdateRequest) => {
    return await post('/Supervisor/Update', data);
  };

  // 新增主管
  const createSupervisor = async (data: SupervisorUpdateRequest) => {
    return await post('/Supervisor/Create', data);
  };

  // 匯出主管資訊
  const exportSupervisorInfo = async () => {
    return await get('/Supervisor/Export');
  };

  // 取得員工選項（用於下拉選單）
  const getEmployeeOptions = (): EmployeeOption[] => {
    return [
      { label: 'choose employee', value: '' },
      { label: 'John Smith', value: 'E001' },
      { label: 'Jane Doe', value: 'E002' },
      { label: 'Mike Johnson', value: 'E003' },
      { label: 'Sarah Williams', value: 'E004' },
      { label: 'David Brown', value: 'E005' },
    ];
  };

  return {
    isLoading: loading,
    getSupervisors,
    updateSupervisor,
    createSupervisor,
    exportSupervisorInfo,
    getEmployeeOptions,
  };
}
