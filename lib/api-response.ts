import type { ApiResponse } from "@/types/api";

export function unwrapApiResponse<T>(response: ApiResponse<T>) {
  return response.data;
}
