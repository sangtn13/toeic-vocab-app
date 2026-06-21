import axios from "axios";
import { apiConfig } from "@/config/api";
import { useAuthStore } from "@/store/auth-store";
import { toApiClientError } from "@/utils/error";

export const apiClient = axios.create({
  baseURL: apiConfig.browserBaseUrl,
  timeout: apiConfig.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiClientError(error))
);

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});
