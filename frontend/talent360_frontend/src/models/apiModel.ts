import type { Ref } from 'vue';

export interface ApiBaseResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T | null;
}

export interface ApiResponse<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  get: (url: string) => Promise<T | undefined>;
  post: (url: string, payload: unknown) => Promise<T | undefined>;
  put: (url: string, payload: unknown) => Promise<T | undefined>;
  del: (url: string) => Promise<T | undefined>;
}
