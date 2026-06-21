import type { UserRole } from "@/types/auth";
import type { Locale } from "@/lib/preferences";

const roleLabels = {
  en: {
    roles: {
      ADMIN: "Administrator",
      USER: "Learner",
      GUEST: "Guest"
    },
    roleBadges: {
      ADMIN: "Admin",
      USER: "Learner",
      GUEST: "Guest"
    }
  },
  vi: {
    roles: {
      ADMIN: "Quản trị viên",
      USER: "Người học",
      GUEST: "Khách"
    },
    roleBadges: {
      ADMIN: "Admin",
      USER: "Học viên",
      GUEST: "Khách"
    }
  }
} as const;

export function getRoleLabel(role?: UserRole | null, locale: Locale = "vi") {
  const labels = roleLabels[locale];

  switch (role) {
    case "ADMIN":
      return labels.roles.ADMIN;
    case "USER":
      return labels.roles.USER;
    default:
      return labels.roles.GUEST;
  }
}

export function getRoleBadgeLabel(role?: UserRole | null, locale: Locale = "vi") {
  const labels = roleLabels[locale];

  switch (role) {
    case "ADMIN":
      return labels.roleBadges.ADMIN;
    case "USER":
      return labels.roleBadges.USER;
    default:
      return labels.roleBadges.GUEST;
  }
}
