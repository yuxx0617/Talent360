export interface Employee {
  id: string;
  name: string;
  division: string;
  department: string;
  team: string;
  permission: string;
}

export interface EmployeeListResponse {
  isSuccess: boolean;
  message: string;
  data: Employee[];
  totalCount: number;
  totalPages: number;
}

export interface EmployeeUpdateRequest {
  id: string;
  permission: string;
}

export interface PermissionOption {
  label: string;
  value: string;
}
