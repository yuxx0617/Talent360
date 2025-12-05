import { useApi } from '../composables/useApi';
import type { EventListResponse, CreateEventRequest, FormOption } from '../models/eventManagementModel';

export function useEventManagementApi() {
  const { loading, get, post } = useApi<EventListResponse>();

  // 取得事件列表
  const getEvents = async () => {
    return await get('/Event/List');
  };

  // 建立新事件
  const createEvent = async (data: CreateEventRequest) => {
    return await post('/Event/Create', data);
  };

  // 取得表單選項
  const getFormOptions = (): FormOption[] => {
    return [
      { label: 'choose Form', value: '' },
      { label: 'Performance Review Form', value: 'form_001' },
      { label: 'Annual Evaluation Form', value: 'form_002' },
      { label: '360 Feedback Form', value: 'form_003' },
    ];
  };

  // 根據 formId 取得表單名稱
  const getFormNameById = (formId: string): string => {
    const options = getFormOptions();
    const found = options.find((o) => o.value === formId);
    return found?.label || '';
  };

  return {
    isLoading: loading,
    getEvents,
    createEvent,
    getFormOptions,
    getFormNameById,
  };
}
