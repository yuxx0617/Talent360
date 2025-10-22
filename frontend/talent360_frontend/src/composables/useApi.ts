import { ref } from 'vue';
import type { Ref } from 'vue';
import api from '../services/api';
import type { ApiBaseResponse, ApiResponse } from 'src/models/apiModel';

export function useApi<T = unknown>(): ApiResponse<T> {
  const data: Ref<T | null> = ref(null);
  const loading = ref(false);
  const error: Ref<unknown> = ref(null);

  const executeRequest = async (
    method: string,
    url: string,
    payload: unknown = null,
  ): Promise<T | undefined> => {
    loading.value = true;
    error.value = null;

    try {
      const axiosResponse = await api.request<ApiBaseResponse<T>>({
        url,
        method,
        data: payload,
      });

      const responseData = axiosResponse.data;

      if (!responseData.isSuccess) {
        const apiError = new Error(responseData.message);
        throw apiError;
      }

      data.value = responseData.data;
      if (responseData.data === null) {
        return undefined;
      }
      return responseData.data;
    } catch (e: unknown) {
      error.value = e;
      console.error(`API 請求失敗 (${method} ${url}):`, e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const get = (url: string) => executeRequest('GET', url);
  const post = (url: string, payload: unknown) => executeRequest('POST', url, payload);
  const put = (url: string, payload: unknown) => executeRequest('PUT', url, payload);
  const del = (url: string) => executeRequest('DELETE', url);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    del,
  };
}
