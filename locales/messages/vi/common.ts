export const commonMessagesVi = {
  shared: {
    retry: "Thử lại"
  },
  labels: {
    roles: {
      ADMIN: "Quản trị viên",
      USER: "Học viên",
      GUEST: "Khách"
    },
    roleBadges: {
      ADMIN: "Quản trị",
      USER: "Học viên",
      GUEST: "Khách"
    },
    practiceModes: {
      GUESS_WORD: "Đoán từ",
      FLASHCARD: "Thẻ lật",
      MULTIPLE_CHOICE: "Trắc nghiệm",
      REVERSE_MULTIPLE_CHOICE: "Trắc nghiệm đảo"
    },
    statusTones: {
      COMPLETED: "Đã hoàn thành",
      IN_PROGRESS: "Đang học",
      AVAILABLE: "Sẵn sàng",
      READY: "Sẵn sàng"
    },
    partOfSpeech: {
      NOUN: "Danh từ",
      VERB: "Động từ",
      PHRASAL_VERB: "Cụm động từ",
      ADJECTIVE: "Tính từ",
      ADVERB: "Trạng từ",
      PHRASE: "Cụm từ",
      OTHER: "Khác",
      DEFAULT: "Từ vựng"
    },
    vocabularyLevels: {
      FOUNDATION: "Nền tảng",
      CORE: "Trọng tâm",
      ADVANCED: "Nâng cao"
    },
    studySetStatus: {
      PUBLISHED: "Hiện cho người học",
      DRAFT: "Bản nháp",
      ARCHIVED: "Lưu trữ",
      UNKNOWN: "Chưa xác định"
    },
    studySetLearningStatus: {
      COMPLETED: "Đã xong",
      IN_PROGRESS: "Đang học",
      NOT_STARTED: "Chưa học"
    }
  },
  errors: {
    apiGeneric: "Đã có lỗi xảy ra khi gọi API.",
    defaultUserFacing: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    network: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.",
    timeout: "Máy chủ phản hồi quá chậm. Vui lòng thử lại sau ít phút.",
    invalidCredentials: "Email hoặc mật khẩu chưa đúng.",
    duplicate: "Thông tin này đã tồn tại trong hệ thống.",
    invalidProgress: "Tiến độ học hiện tại không còn hợp lệ. Vui lòng tải lại để tiếp tục.",
    validation: "Vui lòng điền đầy đủ thông tin bắt buộc.",
    invalidEmail: "Địa chỉ email chưa đúng định dạng.",
    badRequest: "Dữ liệu gửi lên chưa hợp lệ. Vui lòng kiểm tra lại.",
    unauthorized: "Trạng thái đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại.",
    permissionDenied: "Bạn không có quyền thực hiện thao tác này.",
    notFound: "Không tìm thấy dữ liệu bạn cần.",
    conflict: "Dữ liệu đang xung đột hoặc đã tồn tại.",
    server: "Máy chủ đang bận hoặc gặp sự cố. Vui lòng thử lại sau."
  }
};
