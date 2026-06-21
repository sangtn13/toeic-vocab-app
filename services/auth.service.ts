import { apiEndpoints } from "@/config/api";
import { unwrapApiResponse } from "@/lib/api-response";
import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload
} from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      apiEndpoints.auth.register,
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async login(payload: LoginPayload) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      apiEndpoints.auth.login,
      payload
    );
    return unwrapApiResponse(response.data);
  },

  async me() {
    const response = await apiClient.get<ApiResponse<AuthUser>>(apiEndpoints.auth.me);
    return unwrapApiResponse(response.data);
  },

  async logout() {
    const response = await apiClient.post<ApiResponse<void>>(apiEndpoints.auth.logout);
    return unwrapApiResponse(response.data);
  }
};
