import { useApi } from '../composables/useApi';
import type { FormListResponse, FormInfo, FormTypeOption } from '../models/formManagementModel';

export function useFormManagementApi() {
  const { loading, get, post } = useApi<FormListResponse>();

  // 取得表單列表
  const getForms = async () => {
    return await get('/Form/List');
  };

  // 建立新表單
  const createForm = async (data: FormInfo) => {
    return await post('/Form/Create', data);
  };

  // 更新表單狀態
  const updateFormStatus = async (id: number, isActive: boolean) => {
    return await post('/Form/UpdateStatus', { id, isActive });
  };

  // 取得表單類型選項
  const getFormTypeOptions = (): FormTypeOption[] => {
    return [
      { label: 'choose Form Type', value: '' },
      { label: 'Performance Review', value: 'Performance' },
      { label: '360 Feedback', value: 'Feedback' },
      { label: '360 Review', value: '360Review' },
      { label: 'Custom Form', value: 'Custom' },
    ];
  };

  // 取得問題類型說明
  const getQuestionTypeLabel = (type: number): string => {
    const labels: Record<number, string> = {
      1: 'Text Input',
      2: 'Text Area',
      3: 'Single Choice',
      4: 'Multiple Choice',
      5: 'Rating Scale',
      6: 'Date Picker',
      7: 'File Upload',
    };
    return labels[type] || 'Unknown';
  };

  return {
    isLoading: loading,
    getForms,
    createForm,
    updateFormStatus,
    getFormTypeOptions,
    getQuestionTypeLabel,
  };
}
