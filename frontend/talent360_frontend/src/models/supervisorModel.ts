export interface Supervisor {
  id: number;
  division: string;
  department: string;
  team: string;
  role: string;
  supervisorId: string;
  supervisorName: string;
  isActive: boolean;
}

export interface SupervisorListResponse {
  isSuccess: boolean;
  message: string;
  data: Supervisor[];
  totalCount: number;
  totalPages: number;
}

export interface SupervisorUpdateRequest {
  id: number;
  supervisorId: string;
  isActive: boolean;
}

export interface EmployeeOption {
  label: string;
  value: string;
}
