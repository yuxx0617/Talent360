export interface EventInfo {
  id?: number;
  eventName: string;
  formId: string;
  formName: string;
  applicationPeriod: DateRange;
  writeFormPeriod: DateRange;
  hrReviewPeriod: DateRange;
  mainSupervisorReviewPeriod: DateRange;
  status: EventStatus;
  whomReview: string;
  candidateNumber: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export type EventStatus = 'Applying' | 'Reviewing' | 'Completed' | 'Draft';

export interface FormOption {
  label: string;
  value: string;
}

export interface EventListResponse {
  isSuccess: boolean;
  message: string;
  data: EventInfo[];
  totalCount: number;
}

export interface CreateEventRequest {
  eventName: string;
  formId: string;
  applicationPeriod: DateRange;
  writeFormPeriod: DateRange;
  hrReviewPeriod: DateRange;
  mainSupervisorReviewPeriod: DateRange;
}
