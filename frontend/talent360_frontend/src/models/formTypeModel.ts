// Form Type 相關型別定義

export interface FormTypeInfo {
  id?: number;
  formTypeName: string;
  office: string;
  whomReview: WhomReview;
  otherTypeLimit: OtherTypeLimit;
  jobTitles: string[];
  jobGrades: string[];
  quarters: string[];
  isActive: boolean;
}

export interface WhomReview {
  hr: boolean;
  mainSupervisor: boolean;
  reviewer: boolean;
}

export interface OtherTypeLimit {
  jobTitle: boolean;
  jobGrade: boolean;
  quarter: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type CreateFormTypeStep = 'formType' | 'basicLimit' | 'otherLimit' | 'preview';

// API Response
export interface FormTypeListResponse {
  success: boolean;
  data: FormTypeInfo[];
}

export interface CreateFormTypeRequest {
  formTypeName: string;
  office: string;
  whomReview: WhomReview;
  otherTypeLimit: OtherTypeLimit;
  jobTitles: string[];
  jobGrades: string[];
  quarters: string[];
}
