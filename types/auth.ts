import type { EntityId } from "@/types/common";

export type UserRole = "ADMIN" | "USER";

export type AuthUser = {
  id: EntityId;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
};
