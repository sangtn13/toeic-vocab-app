import axios from "axios";
import type { Locale } from "@/lib/preferences";

const commonErrorsByLocale = {
  en: {
    apiGeneric: "An error occurred while calling the API.",
    defaultUserFacing: "Something went wrong. Please try again.",
    network: "Unable to connect to the server. Please check your network and try again.",
    timeout: "The server is taking too long to respond. Please try again shortly.",
    invalidCredentials: "Your email or password is incorrect.",
    duplicate: "This information already exists.",
    invalidProgress: "The current study progress is no longer valid. Please reload to continue.",
    validation: "Please fill in all required information.",
    invalidEmail: "The email address format is invalid.",
    badRequest: "The submitted data is invalid. Please review and try again.",
    unauthorized: "Your sign-in is no longer valid. Please sign in again.",
    permissionDenied: "You do not have permission to perform this action.",
    notFound: "The requested data could not be found.",
    conflict: "The data is conflicting or already exists.",
    server: "The server is busy or encountered an issue. Please try again later."
  },
  vi: {
    apiGeneric: "Đã xảy ra lỗi khi gọi API.",
    defaultUserFacing: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    network: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.",
    timeout: "Máy chủ phản hồi quá chậm. Vui lòng thử lại sau ít phút.",
    invalidCredentials: "Email hoặc mật khẩu không đúng.",
    duplicate: "Thông tin này đã tồn tại.",
    invalidProgress: "Tiến độ học hiện tại không còn hợp lệ. Vui lòng tải lại để tiếp tục.",
    validation: "Vui lòng điền đầy đủ các thông tin bắt buộc.",
    invalidEmail: "Định dạng email không hợp lệ.",
    badRequest: "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra và thử lại.",
    unauthorized: "Phiên đăng nhập của bạn không còn hợp lệ. Vui lòng đăng nhập lại.",
    permissionDenied: "Bạn không có quyền thực hiện thao tác này.",
    notFound: "Không tìm thấy dữ liệu được yêu cầu.",
    conflict: "Dữ liệu đang bị xung đột hoặc đã tồn tại.",
    server: "Máy chủ đang bận hoặc gặp sự cố. Vui lòng thử lại sau."
  }
} as const;

function getCommonErrors(locale: Locale = "vi") {
  return commonErrorsByLocale[locale];
}

class ApiClientError extends Error {
  status?: number;
  rawMessage?: string;

  constructor(message: string, status?: number, rawMessage?: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.rawMessage = rawMessage ?? message;
  }
}

function getErrorMessage(error: unknown) {
  const fallback = getCommonErrors("vi").apiGeneric;

  if (axios.isAxiosError(error)) {
    return (
      getResponseMessage(error.response?.data) ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function toApiClientError(error: unknown) {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const rawMessage = getErrorMessage(error);
    return new ApiClientError(
      rawMessage,
      typeof error.response?.status === "number" ? error.response.status : undefined,
      rawMessage
    );
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message, undefined, error.message);
  }

  return new ApiClientError(getCommonErrors("vi").apiGeneric);
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallback?: string,
  locale: Locale = "vi"
) {
  const commonErrors = getCommonErrors(locale);
  const defaultMessage = fallback || commonErrors.defaultUserFacing;

  if (error instanceof ApiClientError) {
    return translateErrorMessage(error.rawMessage || error.message, error.status, defaultMessage, locale);
  }

  if (axios.isAxiosError(error)) {
    const status =
      typeof error.response?.status === "number" ? error.response.status : undefined;
    return translateErrorMessage(getErrorMessage(error), status, defaultMessage, locale);
  }

  if (error instanceof Error) {
    return translateErrorMessage(error.message, undefined, defaultMessage, locale);
  }

  return defaultMessage;
}

function getResponseMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  return null;
}

function translateErrorMessage(
  message: string,
  status?: number,
  fallback?: string,
  locale: Locale = "vi"
) {
  const commonErrors = getCommonErrors(locale);
  const defaultMessage = fallback || commonErrors.defaultUserFacing;
  const normalized = message.trim().toLowerCase();

  if (!normalized) {
    return defaultMessage;
  }

  if (
    normalized.includes("network error") ||
    normalized.includes("failed to fetch") ||
    normalized.includes("load failed") ||
    normalized.includes("fetch failed")
  ) {
    return commonErrors.network;
  }

  if (
    normalized.includes("timeout") ||
    normalized.includes("timed out") ||
    normalized.includes("ecconnaborted")
  ) {
    return commonErrors.timeout;
  }

  if (
    normalized.includes("invalid credentials") ||
    normalized.includes("bad credentials") ||
    normalized.includes("wrong password") ||
    normalized.includes("incorrect password")
  ) {
    return commonErrors.invalidCredentials;
  }

  if (
    normalized.includes("email already exists") ||
    normalized.includes("user already exists") ||
    normalized.includes("already registered") ||
    normalized.includes("duplicate")
  ) {
    return commonErrors.duplicate;
  }

  if (mentionsProgress(normalized)) {
    if (
      normalized.includes("invalid") ||
      normalized.includes("expired") ||
      normalized.includes("missing") ||
      normalized.includes("not found") ||
      normalized.includes("not exist")
    ) {
      return commonErrors.invalidProgress;
    }
  }

  if (
    normalized.includes("must not be blank") ||
    normalized.includes("must not be null") ||
    normalized.includes("must not be empty") ||
    normalized.includes("should not be blank") ||
    normalized.includes("validation failed")
  ) {
    return commonErrors.validation;
  }

  if (
    normalized.includes("invalid email") ||
    normalized.includes("must be a well-formed email")
  ) {
    return commonErrors.invalidEmail;
  }

  if (status === 400) {
    return commonErrors.badRequest;
  }

  if (status === 401) {
    return mentionsCredential(normalized)
      ? commonErrors.invalidCredentials
      : commonErrors.unauthorized;
  }

  if (status === 403) {
    return commonErrors.permissionDenied;
  }

  if (status === 404) {
    return commonErrors.notFound;
  }

  if (status === 409) {
    return commonErrors.conflict;
  }

  if (status !== undefined && status >= 500) {
    return commonErrors.server;
  }

  if (normalized.startsWith("request failed with status code")) {
    return defaultMessage;
  }

  return defaultMessage;
}

function mentionsCredential(message: string) {
  return (
    message.includes("credential") ||
    message.includes("login") ||
    message.includes("password") ||
    message.includes("email") ||
    message.includes("auth")
  );
}

function mentionsProgress(message: string) {
  return (
    message.includes("progress") ||
    message.includes("token") ||
    message.includes("study progress")
  );
}
