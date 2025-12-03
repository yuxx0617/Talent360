import { useApi } from '../composables/useApi';
import type { OrganizationListResponse } from '../models/organizationModel';

export function useOrganizationApi() {
  const { loading, get, post } = useApi<OrganizationListResponse>();

  // 取得組織列表
  const getOrganizations = async (page: number = 1, pageSize: number = 5) => {
    return await get(`/Organization?page=${page}&pageSize=${pageSize}`);
  };

  // 取得組織詳情
  const getOrganizationDetail = async (id: number) => {
    return await get(`/Organization/${id}`);
  };

  // 同步資料
  const syncData = async () => {
    return await post('/Organization/SyncData', {});
  };

  // 產生組織圖
  const generateChart = async () => {
    return await get('/Organization/GenerateChart');
  };

  return {
    isLoading: loading,
    getOrganizations,
    getOrganizationDetail,
    syncData,
    generateChart,
  };
}
