export interface Organization {
  id: number;
  division: string;
  department: string;
  team: string;
}

export interface OrganizationListResponse {
  isSuccess: boolean;
  message: string;
  data: Organization[];
  totalCount: number;
  totalPages: number;
}

export interface OrganizationDetail {
  id: number;
  division: string;
  department: string;
  team: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
}
