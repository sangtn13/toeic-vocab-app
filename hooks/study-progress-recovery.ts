import { useProgressStore } from "@/store/progress-store";
import { isApiClientError } from "@/utils/error";

export function shouldRecoverProgress(error: unknown) {
  if (!isApiClientError(error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  const mentionsProgress =
    message.includes("progress") ||
    message.includes("token") ||
    message.includes("tiến độ") ||
    message.includes("tien do");
  const looksInvalidProgressMessage =
    mentionsProgress &&
    [
      "invalid",
      "expired",
      "missing",
      "not found",
      "not exist",
      "không hợp lệ",
      "hết hạn",
      "không tồn tại",
      "không tìm thấy",
      "không có"
    ].some((fragment) => message.includes(fragment));

  if (error.status === 401 || error.status === 404) {
    return mentionsProgress;
  }

  if (error.status === 400 || error.status === 409) {
    return looksInvalidProgressMessage;
  }

  return false;
}

export function recoverStudyProgress() {
  const store = useProgressStore.getState();

  if (!store.progress?.progressToken) {
    return;
  }

  store.clearProgress();
}
