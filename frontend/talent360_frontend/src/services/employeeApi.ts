import { useApi } from '../composables/useApi';
import type { ApiBaseResponse } from '../models/apiModel';
import type { LoginRequest, LoginResponse } from '../models/employeeModel';

interface EmployeeLoginResult {
  data: ApiBaseResponse<LoginResponse> | null;
}

export function useEmployeeApi() {
  const { loading, post } = useApi<EmployeeLoginResult>();

  const isLoading = loading;

  const employeeLogin = async (form: LoginRequest) => {
    const result = await post('/Employee/Login', form);
    return result;
  };

  return {
    isLoading: isLoading,
    employeeLogin,
  };
}
