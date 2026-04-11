"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { pb } from "@/services/pb";
import { useAuthStore } from "./auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    useAuthStore.setState({
      record: pb.authStore.record,
      isValid: pb.authStore.isValid,
      isSuperuser: pb.authStore.isSuperuser,
      isInitialized: true,
    });

    const unsubscribe = pb.authStore.onChange(() => {
      useAuthStore.setState({
        record: pb.authStore.record,
        isValid: pb.authStore.isValid,
        isSuperuser: pb.authStore.isSuperuser,
        isInitialized: true,
      });
    });

    return unsubscribe;
  }, []);

  return <>{children}</>;
}

export function useAuth() {
  return useAuthStore();
}
