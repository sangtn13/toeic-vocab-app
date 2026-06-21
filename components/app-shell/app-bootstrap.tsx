"use client";

import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";

export function AppBootstrap() {
  useAuthBootstrap();

  return null;
}
