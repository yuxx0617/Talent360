import { useApi } from '../composables/useApi';
import type {
  FormTypeListResponse,
  CreateFormTypeRequest,
  SelectOption,
} from '../models/formTypeModel';

export function useFormTypeApi() {
  const { loading, get, post } = useApi<FormTypeListResponse>();

  // 取得 Form Type 列表
  const getFormTypes = async () => {
    return await get('/FormType/List');
  };

  // 建立新 Form Type
  const createFormType = async (data: CreateFormTypeRequest) => {
    return await post('/FormType/Create', data);
  };

  // 取得 Office 選項
  const getOfficeOptions = (): SelectOption[] => {
    return [
      { label: 'choose Office', value: '' },
      { label: 'Taiwan Office', value: 'taiwan' },
      { label: 'Japan Office', value: 'japan' },
      { label: 'USA Office', value: 'usa' },
      { label: 'Singapore Office', value: 'singapore' },
    ];
  };

  // 取得 Job Title 選項
  const getJobTitleOptions = (): SelectOption[] => {
    return [
      { label: 'choose Job Title', value: '' },
      { label: 'E3-8', value: 'E3-8' },
      { label: 'E3-9', value: 'E3-9' },
      { label: 'E3-10', value: 'E3-10' },
      { label: 'E4-1', value: 'E4-1' },
      { label: 'E4-2', value: 'E4-2' },
    ];
  };

  // 取得 Job Grade 選項
  const getJobGradeOptions = (): SelectOption[] => {
    return [
      { label: 'choose Job Grade', value: '' },
      { label: 'Junior', value: 'junior' },
      { label: 'Senior', value: 'senior' },
      { label: 'Lead', value: 'lead' },
      { label: 'Manager', value: 'manager' },
    ];
  };

  // 取得 Quarter 選項
  const getQuarterOptions = (): SelectOption[] => {
    return [
      { label: 'choose Quarter', value: '' },
      { label: 'Q1', value: 'Q1' },
      { label: 'Q2', value: 'Q2' },
      { label: 'Q3', value: 'Q3' },
      { label: 'Q4', value: 'Q4' },
    ];
  };

  return {
    isLoading: loading,
    getFormTypes,
    createFormType,
    getOfficeOptions,
    getJobTitleOptions,
    getJobGradeOptions,
    getQuarterOptions,
  };
}
